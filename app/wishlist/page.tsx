"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, Loader2 } from "lucide-react";
import ProductCard from "@/components/ProductCard";

interface Product {
  id: string; slug: string; name: string; tagline: string; price: number;
  originalPrice?: number; size: string; category: string; rating: number;
  reviewCount: number; images: string[]; description: string;
  ingredients: string[]; howToUse: string[]; benefits: string[]; badges: string[];
  inStock: boolean; featured: boolean;
}

export default function WishlistPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading]   = useState(true);
  const [slugs, setSlugs]       = useState<string[]>([]);

  useEffect(() => {
    let saved: string[] = [];
    try {
      saved = JSON.parse(localStorage.getItem("fluno_likes") ?? "[]");
    } catch { /* corrupt data */ }
    setSlugs(saved);

    if (!saved.length) {
      setLoading(false);
      return;
    }

    fetch("/api/products")
      .then((r) => r.json())
      .then((d) => {
        const all: Product[] = (d.products ?? []).map((p: Record<string, unknown>) => ({
          id: (p._id as string) ?? (p.slug as string),
          slug: p.slug as string,
          name: p.name as string,
          tagline: (p.tagline as string) ?? "",
          price: p.price as number,
          originalPrice: p.originalPrice as number | undefined,
          size: (p.size as string) ?? "",
          category: (p.category as string) ?? "",
          rating: (p.rating as number) ?? 0,
          reviewCount: (p.reviewCount as number) ?? 0,
          images: (p.images as string[]) ?? [],
          description: (p.description as string) ?? "",
          ingredients: (p.ingredients as string[]) ?? [],
          howToUse: (p.howToUse as string[]) ?? [],
          benefits: (p.benefits as string[]) ?? [],
          badges: (p.badges as string[]) ?? [],
          inStock: (p.inStock as boolean) ?? true,
          featured: (p.featured as boolean) ?? false,
        }));
        setProducts(all.filter((p) => saved.includes(p.slug)));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 min-h-[60vh]">
      <p className="font-mono text-xs text-fluno-teal uppercase tracking-widest mb-2 flex items-center gap-1.5">
        <Heart size={12} /> Saved for later
      </p>
      <h1 className="section-title mb-3">Your Wishlist</h1>
      <p className="font-body text-fluno-ink/55 mb-10">
        Products you&apos;ve saved. They&apos;re stored on this device — add them to your cart whenever you&apos;re ready.
      </p>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 size={28} className="animate-spin text-fluno-purple" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-fluno-purple/10 flex items-center justify-center mx-auto mb-5">
            <Heart size={26} className="text-fluno-purple/50" />
          </div>
          <h2 className="font-display text-lg text-fluno-ink font-semibold mb-2">
            {slugs.length ? "Saved products unavailable" : "Nothing saved yet"}
          </h2>
          <p className="font-body text-sm text-fluno-ink/50 mb-7 max-w-sm mx-auto">
            {slugs.length
              ? "The products you saved are no longer available."
              : "Tap the ♡ Wishlist button on any product to save it here."}
          </p>
          <Link href="/shop" className="btn-primary">Browse Products</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
