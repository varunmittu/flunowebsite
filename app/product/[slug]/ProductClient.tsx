"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Star, ShieldCheck, ChevronDown, ChevronUp, ArrowLeft } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface Product {
  id: string; slug: string; name: string; tagline: string; price: number;
  originalPrice?: number; size: string; category: string; rating: number;
  reviewCount: number; images: string[]; description: string;
  ingredients: string[]; howToUse: string[]; benefits: string[]; badges: string[];
  inStock: boolean;
}

export default function ProductClient({ product, related }: { product: Product; related: Product[] }) {
  const { addItem } = useCart();
  const [activeImage, setActiveImage] = useState(0);
  const [openSection, setOpenSection] = useState<string | null>("ingredients");
  const [qty, setQty] = useState(1);

  function toggle(section: string) { setOpenSection(openSection === section ? null : section); }

  function handleAdd() {
    for (let i = 0; i < qty; i++) {
      addItem({ id: product.id, slug: product.slug, name: product.name, price: product.price, size: product.size, image: product.images[0] });
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <nav className="flex items-center gap-2 text-sm text-fluno-ink/40 mb-8 font-body">
        <Link href="/shop" className="flex items-center gap-1 hover:text-fluno-purple"><ArrowLeft size={14} /> Shop</Link>
        <span>/</span>
        <span className="text-fluno-ink">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Gallery */}
        <div>
          <div className="aspect-square rounded-2xl overflow-hidden bg-fluno-lavender/30 relative">
            <Image src={product.images[activeImage]} alt={product.name} fill priority className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-3 mt-4">
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setActiveImage(i)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${activeImage === i ? "border-fluno-purple" : "border-fluno-lavender/40 hover:border-fluno-purple/50"}`}>
                  <Image src={img} alt={`${product.name} view ${i + 1}`} width={80} height={80} className="object-cover w-full h-full" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <div className="flex flex-wrap gap-2 mb-4">
            {product.badges.map((b) => <span key={b} className="badge">{b}</span>)}
          </div>

          <h1 className="font-display text-3xl md:text-4xl text-fluno-ink leading-tight">{product.name}</h1>
          <p className="font-body text-fluno-muted mt-2">{product.tagline}</p>

          <div className="flex items-center gap-2 mt-4">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={16} className={s <= Math.floor(product.rating) ? "text-amber-400 fill-amber-400" : "text-fluno-lavender"} />
              ))}
            </div>
            <span className="font-mono text-sm text-fluno-muted">{product.rating} ({product.reviewCount} reviews)</span>
          </div>

          <div className="flex items-baseline gap-3 mt-6">
            <span className="font-display text-4xl text-fluno-purple font-semibold">₹{product.price}</span>
            {product.originalPrice && <span className="font-mono text-lg text-fluno-muted line-through">₹{product.originalPrice}</span>}
            <span className="font-mono text-sm text-fluno-muted">{product.size}</span>
          </div>

          <p className="font-body text-fluno-ink/70 mt-5 leading-relaxed">{product.description}</p>

          <ul className="mt-5 space-y-2">
            {product.benefits.map((b) => (
              <li key={b} className="flex items-center gap-2 text-sm font-body text-fluno-ink/70">
                <ShieldCheck size={14} className="text-fluno-purple flex-shrink-0" />{b}
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-4 mt-8">
            <div className="flex items-center border border-fluno-lavender rounded-xl overflow-hidden">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-3 text-fluno-muted hover:text-fluno-purple hover:bg-fluno-lavender/30 transition-colors">−</button>
              <span className="px-4 font-mono text-sm">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="px-3 py-3 text-fluno-muted hover:text-fluno-purple hover:bg-fluno-lavender/30 transition-colors">+</button>
            </div>
            <button onClick={handleAdd} disabled={!product.inStock} className="btn-primary flex-1">
              {product.inStock ? "Add to Cart" : "Out of Stock"}
            </button>
          </div>

          <div className="mt-6 p-4 bg-fluno-purple/5 border border-fluno-purple/20 rounded-2xl flex items-start gap-3">
            <ShieldCheck size={18} className="text-fluno-purple mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-body text-sm font-medium text-fluno-purple">Ingredient Safety Verified</p>
              <p className="font-mono text-xs text-fluno-muted mt-0.5">Formulated against EU/UK ingredient-safety standards</p>
            </div>
          </div>

          <div className="mt-8 space-y-2">
            {[
              { key: "ingredients", label: "Ingredients (INCI)", content: product.ingredients.join(", ") },
              { key: "howto", label: "How to Use", content: "" },
            ].map(({ key, label }) => (
              <div key={key} className="border border-fluno-lavender/40 rounded-xl overflow-hidden">
                <button onClick={() => toggle(key)} className="w-full flex items-center justify-between px-4 py-3.5 text-left font-body text-sm font-medium text-fluno-ink hover:bg-fluno-lavender/20 transition-colors">
                  {label}
                  {openSection === key ? <ChevronUp size={16} className="text-fluno-purple" /> : <ChevronDown size={16} className="text-fluno-muted" />}
                </button>
                {openSection === key && (
                  <div className="px-4 pb-4 pt-1">
                    {key === "ingredients" ? (
                      <p className="font-mono text-xs text-fluno-muted leading-relaxed">{product.ingredients.join(", ")}</p>
                    ) : (
                      <ol className="space-y-1">
                        {product.howToUse.map((step, i) => (
                          <li key={i} className="font-body text-sm text-fluno-ink/70 flex gap-2">
                            <span className="font-mono text-fluno-purple text-xs mt-0.5 w-4 flex-shrink-0">{i + 1}.</span>
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

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="section-title mb-8">You Might Also Like</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {related.map((p) => (
              <Link key={p.id} href={`/product/${p.slug}`} className="card p-4 flex gap-4 items-center hover:shadow-md transition-shadow">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-fluno-lavender/30 flex-shrink-0 relative">
                  <Image src={p.images[0]} alt={p.name} fill className="object-cover" />
                </div>
                <div>
                  <p className="font-display text-sm text-fluno-ink">{p.name}</p>
                  <p className="font-mono text-xs text-fluno-muted">{p.size}</p>
                  <p className="font-display text-fluno-purple text-sm font-medium mt-1">₹{p.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
