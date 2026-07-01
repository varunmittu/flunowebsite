import { notFound } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import { ProductModel } from "@/lib/models/Product";
import ProductClient from "./ProductClient";
import { getProductBySlug, products as staticProducts } from "@/lib/products";

interface RawProduct {
  _id: unknown;
  slug: string;
  name: string;
  tagline?: string;
  price: number;
  originalPrice?: number;
  size?: string;
  category?: string;
  rating?: number;
  reviewCount?: number;
  images?: string[];
  description?: string;
  ingredients?: string[];
  howToUse?: string[];
  benefits?: string[];
  badges?: string[];
  inStock?: boolean;
  featured?: boolean;
}

function toProduct(doc: RawProduct) {
  return {
    id: doc._id?.toString() ?? doc.slug,
    slug: doc.slug,
    name: doc.name,
    tagline: doc.tagline ?? "",
    price: doc.price,
    originalPrice: doc.originalPrice,
    size: doc.size ?? "",
    category: doc.category ?? "",
    rating: doc.rating ?? 0,
    reviewCount: doc.reviewCount ?? 0,
    images: doc.images ?? [],
    description: doc.description ?? "",
    ingredients: doc.ingredients ?? [],
    howToUse: doc.howToUse ?? [],
    benefits: doc.benefits ?? [],
    badges: doc.badges ?? [],
    inStock: doc.inStock ?? true,
    featured: doc.featured ?? false,
  };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  let product = null;
  let allProducts: ReturnType<typeof toProduct>[] = [];

  try {
    await connectDB();
    const docs = await ProductModel.find({ active: true }).lean() as RawProduct[];
    allProducts = docs.map(toProduct);
    product = allProducts.find((p) => p.slug === params.slug) ?? null;
  } catch {
    // fallback to static data
  }

  if (!product) {
    const staticProduct = getProductBySlug(params.slug);
    if (!staticProduct) notFound();
    product = { ...staticProduct, id: staticProduct.id };
    allProducts = staticProducts.map((p) => ({ ...p, id: p.id, featured: p.featured ?? false, originalPrice: p.originalPrice ?? undefined }));
  }

  const related = allProducts.filter((p) => p.slug !== params.slug).slice(0, 3);

  return <ProductClient product={product} related={related} />;
}
