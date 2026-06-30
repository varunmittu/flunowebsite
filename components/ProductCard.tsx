"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { motion } from "framer-motion";
import type { Product } from "@/lib/products";

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  function handleAdd() {
    addItem({
      id:    product.id,
      slug:  product.slug,
      name:  product.name,
      price: product.price,
      size:  product.size,
      image: product.images[0],
    });
  }

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="card group flex flex-col"
    >
      {/* Image */}
      <Link
        href={`/product/${product.slug}`}
        className="block relative overflow-hidden aspect-square bg-fluno-lavender/30"
      >
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-fluno-dark/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isNew && (
            <span className="badge-dark text-xs">New</span>
          )}
          {product.originalPrice && (
            <span className="badge text-xs bg-fluno-purple text-white">
              {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off
            </span>
          )}
        </div>

        {/* Quick add on hover */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-300">
          <button
            onClick={(e) => { e.preventDefault(); handleAdd(); }}
            disabled={!product.inStock}
            className="btn-primary text-xs px-5 py-2.5 shadow-lg shadow-fluno-purple/30"
          >
            <ShoppingBag size={14} />
            {product.inStock ? "Quick Add" : "Out of Stock"}
          </button>
        </div>
      </Link>

      {/* Info */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 flex-1">
          <div className="flex-1 min-w-0">
            <Link href={`/product/${product.slug}`}>
              <h3 className="font-display text-base text-fluno-ink hover:text-fluno-purple transition-colors leading-snug">
                {product.name}
              </h3>
            </Link>
            <p className="font-mono text-xs text-fluno-muted/60 mt-0.5">{product.size}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="font-brand font-bold text-xl text-fluno-purple">₹{product.price}</p>
            {product.originalPrice && (
              <p className="font-mono text-xs text-fluno-muted/50 line-through">
                ₹{product.originalPrice}
              </p>
            )}
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mt-3">
          <div className="flex">
            {[1,2,3,4,5].map((s) => (
              <Star
                key={s}
                size={12}
                className={
                  s <= Math.floor(product.rating)
                    ? "text-fluno-purple fill-fluno-purple"
                    : "text-fluno-lavender fill-fluno-lavender"
                }
              />
            ))}
          </div>
          <span className="font-mono text-xs text-fluno-muted/60">
            {product.rating} ({product.reviewCount})
          </span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-3 mb-4">
          {product.badges.slice(0, 2).map((b) => (
            <span key={b} className="badge text-[10px]">{b}</span>
          ))}
        </div>

        {/* Add to Cart */}
        <button
          onClick={handleAdd}
          disabled={!product.inStock}
          className="btn-outline w-full mt-auto text-sm"
        >
          <ShoppingBag size={15} />
          {product.inStock ? "Add to Cart" : "Out of Stock"}
        </button>
      </div>
    </motion.div>
  );
}
