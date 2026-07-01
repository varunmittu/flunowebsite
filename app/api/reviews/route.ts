import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Review } from "@/lib/models/Review";
import { ProductModel } from "@/lib/models/Product";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug) return NextResponse.json({ reviews: [] });
  await connectDB();
  const reviews = await Review.find({ productSlug: slug })
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

  await connectDB();

  const session = await getServerSession(authOptions);

  const review = await Review.create({
    productId: productId || productSlug,
    productSlug,
    userId: session?.user?.email ?? undefined,
    name: name.trim(),
    email: email.toLowerCase().trim(),
    rating: Number(rating),
    title: title?.trim() || undefined,
    comment: comment.trim(),
    verified: !!session?.user?.email,
  });

  // Update product's aggregate rating
  const allReviews = await Review.find({ productSlug });
  const avgRating = allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length;
  await ProductModel.updateOne(
    { slug: productSlug },
    { rating: Math.round(avgRating * 10) / 10, reviewCount: allReviews.length }
  );

  return NextResponse.json({ ok: true, review }, { status: 201 });
}
