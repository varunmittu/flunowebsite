"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/lib/products";

const ART_BG = [
  "bg-gradient-to-br from-fig-terracotta/25 to-fig-terracotta/10",
  "bg-gradient-to-br from-fig-mustard/30 to-fig-mustard/10",
  "bg-gradient-to-br from-fig-sage/30 to-fig-sage/10",
];

export default function HomeProductCard({ product, index }: { product: Product; index: number }) {
  const { addItem } = useCart();
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <article className="group bg-fig-paper border-[1.5px] border-fig-navy/10 rounded-3xl overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_18px_40px_-18px_rgba(37,43,66,.25)]">
      <Link
        href={`/product/${product.slug}`}
        className={`relative flex items-end justify-center min-h-[250px] p-6 ${ART_BG[index % ART_BG.length]}`}
      >
        {discount > 0 && product.inStock && (
          <span className="absolute top-4 left-4 z-10 font-fig font-semibold text-[11px] tracking-[0.1em] uppercase bg-fig-navy text-fig-cream rounded-full px-3 py-1.5">
            Save {discount}%
          </span>
        )}
        {!product.inStock && (
          <span className="absolute top-4 left-4 z-10 font-fig font-semibold text-[11px] tracking-[0.1em] uppercase bg-fig-mustard text-fig-navy rounded-full px-3 py-1.5">
            Back soon
          </span>
        )}
        {product.images[0] ? (
          <div className="relative w-full h-[210px] transition-transform duration-300 group-hover:-translate-y-1.5 group-hover:rotate-[-1deg]">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 90vw, 360px"
              className="object-contain drop-shadow-lg"
            />
          </div>
        ) : null}
      </Link>

      <div className="flex flex-col gap-2 p-6 flex-1">
        <span className="font-fig font-semibold text-[11px] tracking-[0.12em] uppercase text-fig-terracotta">
          {product.category}
        </span>
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-fig font-bold text-xl text-fig-navy leading-tight">{product.name}</h3>
        </Link>
        <p className="font-fig-body text-sm text-fig-ink-soft">{product.tagline}</p>

        {product.rating > 0 && (
          <div className="flex items-center gap-2 text-xs text-fig-ink-soft">
            <span className="text-fig-mustard tracking-[2px]" aria-hidden="true">
              {"★".repeat(Math.round(product.rating))}
            </span>
            <span>
              {product.rating} · {product.reviewCount} reviews
            </span>
          </div>
        )}

        <div className="flex flex-wrap gap-1.5 mt-1">
          {product.badges.slice(0, 4).map((b) => (
            <span key={b} className="text-[11px] font-medium border border-fig-navy/15 text-fig-ink-soft rounded-full px-2.5 py-0.5">
              {b}
            </span>
          ))}
        </div>

        <div className="flex items-baseline gap-2.5 mt-auto pt-4 tabular-nums">
          <span className="font-fig font-bold text-2xl text-fig-navy">₹{product.price}</span>
          {product.originalPrice && (
            <>
              <span className="text-sm text-fig-ink-soft line-through">₹{product.originalPrice}</span>
              <span className="text-xs font-semibold text-fig-terracotta">
                Save ₹{Math.round(product.originalPrice - product.price)}
              </span>
            </>
          )}
        </div>

        {product.inStock ? (
          <button
            onClick={() =>
              addItem({
                id: product.id,
                slug: product.slug,
                name: product.name,
                price: product.price,
                size: product.size,
                image: product.images[0],
              })
            }
            className="mt-3 inline-flex items-center justify-center rounded-full bg-fig-terracotta hover:bg-fig-terracotta-deep text-[#FFF6EE] font-fig font-semibold text-[15px] px-6 py-3 transition-all duration-150 hover:-translate-y-px active:translate-y-0"
          >
            Add to cart
          </button>
        ) : (
          <Link
            href={`/product/${product.slug}`}
            className="mt-3 inline-flex items-center justify-center rounded-full bg-fig-navy hover:bg-fig-navy-soft text-fig-cream font-fig font-semibold text-[15px] px-6 py-3 transition-all duration-150 hover:-translate-y-px"
          >
            Notify me when back
          </Link>
        )}
      </div>
    </article>
  );
}
