import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Review } from "@/lib/models/Review";
import { ProductModel } from "@/lib/models/Product";
import { products as staticProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

const MAX_REVIEWS_PER_IP_PER_HOUR = 3;

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug) return NextResponse.json({ reviews: [] });
  await connectDB();
  const reviews = await Review.find(
    { productSlug: slug },
    { email: 0, ip: 0, userId: 0 } // never expose reviewer PII
  )
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();
  return NextResponse.json({ reviews });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { productId, productSlug, name, email, rating, title, comment } = body;

  if (!productSlug || !name || !email || !rating || !comment) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  if (rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Rating must be 1–5" }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }
  if (name.length > 60 || email.length > 120 || (title?.length ?? 0) > 120 || comment.length > 2000) {
    return NextResponse.json({ error: "One of the fields is too long." }, { status: 400 });
  }

  await connectDB();

  // Reject reviews for products that don't exist
  const productExists =
    (await ProductModel.exists({ slug: productSlug })) ||
    staticProducts.some((p) => p.slug === productSlug);
  if (!productExists) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }

  const cleanEmail = email.toLowerCase().trim();
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  // Rate limit: max N new reviews per IP per hour (DB-backed, works across serverless instances)
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const recentFromIp = await Review.countDocuments({ ip, createdAt: { $gte: oneHourAgo } });
  if (recentFromIp >= MAX_REVIEWS_PER_IP_PER_HOUR) {
    return NextResponse.json(
      { error: "Too many reviews submitted. Please try again later." },
      { status: 429 }
    );
  }

  const session = await getServerSession(authOptions);

  // One review per email per product — resubmitting updates the existing one
  const existing = await Review.findOne({ productSlug, email: cleanEmail });

  let review;
  if (existing) {
    existing.name    = name.trim();
    existing.rating  = Number(rating);
    existing.title   = title?.trim() || undefined;
    existing.comment = comment.trim();
    existing.verified = existing.verified || !!session?.user?.email;
    review = await existing.save();
  } else {
    review = await Review.create({
      productId: productId || productSlug,
      productSlug,
      userId: session?.user?.email ?? undefined,
      name: name.trim(),
      email: cleanEmail,
      rating: Number(rating),
      title: title?.trim() || undefined,
      comment: comment.trim(),
      verified: !!session?.user?.email,
      ip,
    });
  }

  // Update product's aggregate rating
  const allReviews = await Review.find({ productSlug });
  const avgRating = allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length;
  await ProductModel.updateOne(
    { slug: productSlug },
    { rating: Math.round(avgRating * 10) / 10, reviewCount: allReviews.length }
  );

  // Return only public fields — no email/ip
  const publicReview = {
    _id:       review._id,
    name:      review.name,
    rating:    review.rating,
    title:     review.title,
    comment:   review.comment,
    verified:  review.verified,
    createdAt: review.createdAt,
  };

  return NextResponse.json(
    { ok: true, review: publicReview, updated: !!existing },
    { status: existing ? 200 : 201 }
  );
}
