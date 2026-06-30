"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, Plus } from "lucide-react";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/lib/products";

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  function handleAdd() {
    addItem({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      size: product.size,
      image: product.images[0],
    });
  }

  return (
    <div className="card group">
      {/* Image */}
      <Link href={`/product/${product.slug}`} className="block relative overflow-hidden aspect-square bg-fluno-stone/20">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {product.isNew && (
          <span className="absolute top-3 left-3 bg-fluno-teal text-white text-xs font-mono px-2 py-0.5 rounded-sm">
            New
          </span>
        )}
      </Link>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <Link href={`/product/${product.slug}`}>
              <h3 className="font-display text-base text-fluno-ink hover:text-fluno-teal transition-colors leading-snug">
                {product.name}
              </h3>
            </Link>
            <p className="font-mono text-xs text-fluno-ink/40 mt-0.5">
              {product.size}
            </p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="font-display text-lg font-medium text-fluno-teal">
              ₹{product.price}
            </p>
            {product.originalPrice && (
              <p className="font-mono text-xs text-fluno-ink/30 line-through">
                ₹{product.originalPrice}
              </p>
            )}
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mt-2">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                size={12}
                className={
                  s <= Math.floor(product.rating)
                    ? "text-amber-400 fill-amber-400"
                    : "text-fluno-stone"
                }
              />
            ))}
          </div>
          <span className="font-mono text-xs text-fluno-ink/40">
            {product.rating} ({product.reviewCount})
          </span>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {product.badges.slice(0, 2).map((b) => (
            <span key={b} className="badge">
              {b}
            </span>
          ))}
        </div>

        {/* Add to Cart */}
        <button
          onClick={handleAdd}
          disabled={!product.inStock}
          className="btn-primary w-full mt-4 text-sm gap-1.5"
        >
          <Plus size={15} />
          {product.inStock ? "Add to Cart" : "Out of Stock"}
        </button>
      </div>
    </div>
  );
}
