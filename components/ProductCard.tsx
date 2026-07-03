"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingBag, Heart } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { motion } from "framer-motion";
import type { Product } from "@/lib/products";

const ART_BG = [
  "bg-gradient-to-br from-fig-terracotta/20 to-fig-terracotta/8",
  "bg-gradient-to-br from-fig-mustard/25 to-fig-mustard/8",
  "bg-gradient-to-br from-fig-sage/25 to-fig-sage/8",
];

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [liked, setLiked] = useState(false);

  function handleAdd(e?: React.MouseEvent) {
    e?.preventDefault();
    e?.stopPropagation();
    addItem({
      id:    product.id,
      slug:  product.slug,
      name:  product.name,
      price: product.price,
      size:  product.size,
      image: product.images[0],
    });
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const artIndex = product.name.length % ART_BG.length;

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="fig-card group flex flex-col relative"
    >
      {/* Image */}
      <Link
        href={`/product/${product.slug}`}
        className={`block relative overflow-hidden ${ART_BG[artIndex]}`}
        style={{ aspectRatio: "4/5" }}
      >
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-fig-navy/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {discount > 0 && (
            <span className="font-fig font-semibold text-[10px] tracking-[0.06em] uppercase bg-fig-navy text-fig-cream px-2.5 py-1 rounded-full shadow-lg">
              {discount}% off
            </span>
          )}
          {(product as { isNew?: boolean }).isNew && (
            <span className="font-fig font-semibold text-[10px] tracking-[0.06em] uppercase bg-fig-sage text-fig-navy px-2.5 py-1 rounded-full shadow-lg">New</span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setLiked(!liked); }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-fig-paper/90 backdrop-blur-sm flex items-center justify-center shadow-md transition-all duration-200 hover:bg-fig-paper hover:scale-110"
          aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            size={14}
            className={liked ? "fill-fig-terracotta text-fig-terracotta" : "text-fig-ink-soft"}
          />
        </button>

        {/* Quick add — slides up on hover */}
        <div className="absolute bottom-4 left-3 right-3 opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-300 ease-out">
          <button
            onClick={handleAdd}
            disabled={!product.inStock}
            className="fig-btn w-full text-xs py-2.5 shadow-lg shadow-fig-terracotta/30"
          >
            <ShoppingBag size={13} />
            {product.inStock ? "Quick Add" : "Out of Stock"}
          </button>
        </div>
      </Link>

      {/* Info */}
      <div className="p-5 flex flex-col flex-1">
        {/* Category */}
        {product.category && (
          <span className="font-fig font-semibold text-[10px] text-fig-terracotta uppercase tracking-[0.12em] mb-1">
            {product.category}
          </span>
        )}

        <div className="flex items-start justify-between gap-2 mb-2">
          <Link href={`/product/${product.slug}`} className="flex-1 min-w-0">
            <h3 className="font-fig font-bold text-base text-fig-navy hover:text-fig-terracotta transition-colors leading-snug">
              {product.name}
            </h3>
            <p className="font-fig-body text-xs text-fig-ink-soft/70 mt-0.5 truncate">{product.size}</p>
          </Link>

          <div className="text-right flex-shrink-0 tabular-nums">
            <p className="font-fig font-bold text-xl text-fig-navy">₹{product.price}</p>
            {product.originalPrice && (
              <p className="font-fig-body text-xs text-fig-ink-soft/50 line-through">₹{product.originalPrice}</p>
            )}
          </div>
        </div>

        {/* Stars */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex">
            {[1,2,3,4,5].map((s) => (
              <Star
                key={s}
                size={11}
                className={s <= Math.floor(product.rating)
                  ? "text-fig-mustard fill-fig-mustard"
                  : "text-fig-navy/15 fill-fig-navy/15"
                }
              />
            ))}
          </div>
          <span className="font-fig-body text-[11px] text-fig-ink-soft/70">
            {product.rating} ({product.reviewCount})
          </span>
        </div>

        {/* Tags */}
        {product.badges.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {product.badges.slice(0, 2).map((b) => (
              <span key={b} className="fig-badge">{b}</span>
            ))}
          </div>
        )}

        {/* Add to Cart */}
        <button
          onClick={() => handleAdd()}
          disabled={!product.inStock}
          className="fig-btn-outline w-full mt-auto text-sm group-hover:bg-fig-terracotta group-hover:text-fig-navy group-hover:border-fig-terracotta transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ShoppingBag size={14} />
          {product.inStock ? "Add to Cart" : "Out of Stock"}
        </button>
      </div>
    </motion.div>
  );
}
