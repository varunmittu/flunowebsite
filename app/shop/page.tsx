"use client";

import { useState, useEffect, useRef } from "react";
import { SlidersHorizontal, Sparkles, Loader2, Grid3X3, LayoutList, Search } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { products as staticProducts } from "@/lib/products";
import { autoAnimate } from "@formkit/auto-animate";

interface Product {
  id: string; slug: string; name: string; tagline: string; price: number;
  originalPrice?: number; size: string; category: string; rating: number;
  reviewCount: number; images: string[]; description: string;
  ingredients: string[]; howToUse: string[]; benefits: string[]; badges: string[];
  inStock: boolean; featured: boolean;
}

const sortOptions = [
  { value: "Featured",            label: "Featured" },
  { value: "Price: Low to High",  label: "Price: Low → High" },
  { value: "Price: High to Low",  label: "Price: High → Low" },
  { value: "Top Rated",           label: "Top Rated" },
];

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>(
    staticProducts.map((p) => ({ ...p, id: p.id, featured: p.featured ?? false }))
  );
  const [categories, setCategories] = useState(["All"]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [sort, setSort]     = useState("Featured");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [gridCols, setGridCols] = useState<3 | 4>(3);

  const gridRef = useRef<HTMLDivElement>(null);

  // Wire auto-animate to product grid
  useEffect(() => {
    if (gridRef.current) {
      autoAnimate(gridRef.current, { duration: 220, easing: "ease-out" });
    }
  }, []);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((d) => {
        if (d.products?.length) {
          const mapped: Product[] = d.products.map((p: Record<string, unknown>) => ({
            id: (p._id as string | undefined) ?? (p.slug as string),
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
          setProducts(mapped);
          const cats = ["All", ...Array.from(new Set(mapped.map((p) => p.category).filter(Boolean)))];
          setCategories(cats);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = products
    .filter((p) => activeCategory === "All" || p.category === activeCategory)
    .filter((p) => !search || p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === "Price: Low to High") return a.price - b.price;
      if (sort === "Price: High to Low") return b.price - a.price;
      if (sort === "Top Rated")          return b.rating - a.rating;
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });

  return (
    <div className="min-h-screen bg-fluno-light">
      {/* ── Page hero ── */}
      <div className="bg-fluno-dark relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-fluno-purple/12 to-transparent" />
          <div className="absolute top-[5%] left-[5%] w-[400px] h-[400px] rounded-full bg-fluno-purple/10 blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-fluno-purple-deep/8 blur-[80px] rounded-full" />
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage: "linear-gradient(rgba(189,126,250,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(189,126,250,.6) 1px, transparent 1px)",
              backgroundSize: "50px 50px",
            }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <p className="eyebrow text-fluno-purple mb-3 flex items-center gap-2">
            <Sparkles size={12} /> The Collection
          </p>
          <h1
            className="font-brand font-bold text-white text-glow leading-none mb-4"
            style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}
          >
            Shop All Products
          </h1>
          <p className="font-body text-white/40 text-base max-w-md">
            {products.length} carefully formulated products — clean ingredients, honest pricing.
          </p>

          {/* Inline search */}
          <div className="relative mt-7 max-w-sm">
            <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products…"
              className="input-dark pl-10"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* ── Filter + sort bar ── */}
        <div className="flex flex-col gap-5 mb-10 pb-8 border-b border-fluno-lavender/60">
          {/* Category chips */}
          <div className="flex gap-2 flex-wrap">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                className={`font-body text-sm px-5 py-2 rounded-full border-2 transition-all duration-200 ${
                  activeCategory === c
                    ? "bg-fluno-purple border-fluno-purple text-white shadow-lg shadow-fluno-purple/20"
                    : "border-fluno-lavender text-fluno-muted hover:border-fluno-purple hover:text-fluno-purple bg-white"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Sort + view toggle */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1 border border-fluno-lavender rounded-xl p-1 bg-white ml-auto">
              <button
                onClick={() => setGridCols(3)}
                className={`p-1.5 rounded-lg transition-all ${gridCols === 3 ? "bg-fluno-purple text-white" : "text-fluno-muted hover:text-fluno-purple"}`}
              >
                <Grid3X3 size={14} />
              </button>
              <button
                onClick={() => setGridCols(4)}
                className={`p-1.5 rounded-lg transition-all ${gridCols === 4 ? "bg-fluno-purple text-white" : "text-fluno-muted hover:text-fluno-purple"}`}
              >
                <LayoutList size={14} />
              </button>
            </div>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="input py-2.5 w-full sm:w-52 text-sm bg-white"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* ── Result count ── */}
        <p className="font-mono text-xs text-fluno-muted/60 mb-7">
          {loading
            ? "Loading…"
            : `Showing ${filtered.length} of ${products.length} product${products.length !== 1 ? "s" : ""}`
          }
        </p>

        {/* ── Grid — auto-animate applied ── */}
        {loading ? (
          <div className="flex justify-center py-28">
            <Loader2 size={32} className="animate-spin text-fluno-purple" />
          </div>
        ) : filtered.length > 0 ? (
          <div
            ref={gridRef}
            className={`grid gap-6 ${
              gridCols === 4
                ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-4"
                : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            }`}
          >
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="text-center py-28">
            <div className="w-20 h-20 rounded-2xl bg-fluno-purple/10 flex items-center justify-center mx-auto mb-5">
              <Sparkles size={28} className="text-fluno-purple/40" />
            </div>
            <p className="font-display text-lg text-fluno-ink/60 mb-2">No products found</p>
            <p className="font-body text-sm text-fluno-muted/60">Try a different category or search term.</p>
            {search && (
              <button onClick={() => setSearch("")} className="btn-outline mt-5 text-sm">
                Clear search
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
