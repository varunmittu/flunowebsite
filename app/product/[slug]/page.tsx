"use client";

import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  Star,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
} from "lucide-react";
import { getProductBySlug, products } from "@/lib/products";
import { useCart } from "@/context/CartContext";

export default function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const productData = getProductBySlug(params.slug);
  if (!productData) notFound();
  const product = productData;

  const { addItem } = useCart();
  const [activeImage, setActiveImage] = useState(0);
  const [openSection, setOpenSection] = useState<string | null>("ingredients");
  const [qty, setQty] = useState(1);

  const related = products.filter((p) => p.id !== product.id).slice(0, 2);

  function toggle(section: string) {
    setOpenSection(openSection === section ? null : section);
  }

  function handleAdd() {
    for (let i = 0; i < qty; i++) {
      addItem({
        id: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        size: product.size,
        image: product.images[0],
      });
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-fluno-ink/40 mb-8 font-body">
        <Link href="/shop" className="flex items-center gap-1 hover:text-fluno-teal">
          <ArrowLeft size={14} /> Shop
        </Link>
        <span>/</span>
        <span className="text-fluno-ink">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Gallery */}
        <div>
          <div className="aspect-square rounded-sm overflow-hidden bg-fluno-stone/20 relative">
            <Image
              src={product.images[activeImage]}
              alt={product.name}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-3 mt-4">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`w-20 h-20 rounded-sm overflow-hidden border-2 transition-colors ${
                    activeImage === i
                      ? "border-fluno-teal"
                      : "border-fluno-stone/40 hover:border-fluno-teal/50"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} view ${i + 1}`}
                    width={80}
                    height={80}
                    className="object-cover w-full h-full"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <div className="flex flex-wrap gap-2 mb-4">
            {product.badges.map((b) => (
              <span key={b} className="badge">
                {b}
              </span>
            ))}
          </div>

          <h1 className="font-display text-3xl md:text-4xl text-fluno-ink leading-tight">
            {product.name}
          </h1>
          <p className="font-body text-fluno-ink/60 mt-2">{product.tagline}</p>

          {/* Rating */}
          <div className="flex items-center gap-2 mt-4">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  size={16}
                  className={
                    s <= Math.floor(product.rating)
                      ? "text-amber-400 fill-amber-400"
                      : "text-fluno-stone"
                  }
                />
              ))}
            </div>
            <span className="font-mono text-sm text-fluno-ink/50">
              {product.rating} ({product.reviewCount} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mt-6">
            <span className="font-display text-4xl text-fluno-teal font-semibold">
              ₹{product.price}
            </span>
            {product.originalPrice && (
              <span className="font-mono text-lg text-fluno-ink/30 line-through">
                ₹{product.originalPrice}
              </span>
            )}
            <span className="font-mono text-sm text-fluno-ink/40">
              {product.size}
            </span>
          </div>

          {/* Description */}
          <p className="font-body text-fluno-ink/70 mt-5 leading-relaxed">
            {product.description}
          </p>

          {/* Benefits */}
          <ul className="mt-5 space-y-2">
            {product.benefits.map((b) => (
              <li key={b} className="flex items-center gap-2 text-sm font-body text-fluno-ink/70">
                <ShieldCheck size={14} className="text-fluno-teal flex-shrink-0" />
                {b}
              </li>
            ))}
          </ul>

          {/* Qty + Add */}
          <div className="flex items-center gap-4 mt-8">
            <div className="flex items-center border border-fluno-stone rounded-sm overflow-hidden">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="px-3 py-3 text-fluno-ink/60 hover:text-fluno-teal hover:bg-fluno-stone/20 transition-colors"
              >
                −
              </button>
              <span className="px-4 font-mono text-sm">{qty}</span>
              <button
                onClick={() => setQty(qty + 1)}
                className="px-3 py-3 text-fluno-ink/60 hover:text-fluno-teal hover:bg-fluno-stone/20 transition-colors"
              >
                +
              </button>
            </div>
            <button
              onClick={handleAdd}
              disabled={!product.inStock}
              className="btn-primary flex-1"
            >
              {product.inStock ? "Add to Cart" : "Out of Stock"}
            </button>
          </div>

          {/* Safety Callout */}
          <div className="mt-6 p-4 bg-fluno-teal/5 border border-fluno-teal/20 rounded-sm flex items-start gap-3">
            <ShieldCheck size={18} className="text-fluno-teal mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-body text-sm font-medium text-fluno-teal">
                Ingredient Safety Verified
              </p>
              <p className="font-mono text-xs text-fluno-ink/50 mt-0.5">
                Formulated against EU/UK ingredient-safety standards
              </p>
            </div>
          </div>

          {/* Accordion */}
          <div className="mt-8 space-y-2">
            {[
              { key: "ingredients", label: "Ingredients (INCI)", content: product.ingredients.join(", ") },
              {
                key: "howto",
                label: "How to Use",
                content: product.howToUse.map((s, i) => `${i + 1}. ${s}`).join("\n"),
              },
            ].map(({ key, label, content }) => (
              <div key={key} className="border border-fluno-stone/40 rounded-sm overflow-hidden">
                <button
                  onClick={() => toggle(key)}
                  className="w-full flex items-center justify-between px-4 py-3.5 text-left font-body text-sm font-medium text-fluno-ink hover:bg-fluno-stone/20 transition-colors"
                >
                  {label}
                  {openSection === key ? (
                    <ChevronUp size={16} className="text-fluno-teal" />
                  ) : (
                    <ChevronDown size={16} className="text-fluno-ink/40" />
                  )}
                </button>
                {openSection === key && (
                  <div className="px-4 pb-4 pt-1">
                    {key === "ingredients" ? (
                      <p className="font-mono text-xs text-fluno-ink/60 leading-relaxed">
                        {content}
                      </p>
                    ) : (
                      <ol className="space-y-1">
                        {product.howToUse.map((step, i) => (
                          <li key={i} className="font-body text-sm text-fluno-ink/70 flex gap-2">
                            <span className="font-mono text-fluno-teal text-xs mt-0.5 w-4 flex-shrink-0">
                              {i + 1}.
                            </span>
                            {step}
                          </li>
                        ))}
                      </ol>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="section-title mb-8">You Might Also Like</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {related.map((p) => (
              <Link key={p.id} href={`/product/${p.slug}`} className="card p-4 flex gap-4 items-center hover:shadow-md transition-shadow">
                <div className="w-16 h-16 rounded-sm overflow-hidden bg-fluno-stone/20 flex-shrink-0 relative">
                  <Image src={p.images[0]} alt={p.name} fill className="object-cover" />
                </div>
                <div>
                  <p className="font-display text-sm text-fluno-ink">{p.name}</p>
                  <p className="font-mono text-xs text-fluno-ink/40">{p.size}</p>
                  <p className="font-display text-fluno-teal text-sm font-medium mt-1">₹{p.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
