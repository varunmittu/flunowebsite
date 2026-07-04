"use client";

import { useState, useEffect, useRef } from "react";
import { Loader2, Grid3X3, LayoutList, Search } from "lucide-react";
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
    <div className="min-h-screen bg-fig-cream">
      {/* ── Page hero ── */}
      <div className="bg-fig-navy relative overflow-hidden border-b-[3px] border-fig-navy">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-[8%] right-[6%] w-52 h-52 rounded-full bg-fig-terracotta/20 blur-[90px]" />
          <div className="absolute bottom-0 left-[10%] w-56 h-56 rounded-full bg-fig-sage/15 blur-[100px]" />
          <span className="absolute top-10 left-[12%] w-3.5 h-3.5 rounded-full bg-fig-mustard/70 animate-float" style={{ animationDelay: "0.2s" }} />
          <span className="absolute bottom-12 right-[16%] w-5 h-5 rounded-full bg-fig-sage/60 animate-float" style={{ animationDelay: "1.3s" }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <p className="fig-eyebrow text-fig-mustard mb-3">
            The collection
          </p>
          <h1
            className="font-fig font-bold text-fig-cream leading-none mb-4 tracking-tight"
            style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}
          >
            Shop all products
          </h1>
          <p className="font-fig-body text-[#C9CCDC] text-base max-w-md">
            {products.length} everyday essentials — thoughtfully formulated, honestly priced.
          </p>

          {/* Inline search */}
          <div className="relative mt-7 max-w-sm">
            <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-fig-cream/40 pointer-events-none z-10" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products…"
              className="w-full border border-fig-cream/20 bg-fig-cream/10 text-fig-cream pl-10 pr-4 py-3 rounded-full font-fig-body text-sm placeholder:text-fig-cream/40 focus:outline-none focus:border-fig-terracotta/70 focus:ring-2 focus:ring-fig-terracotta/25 transition-all"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* ── Filter + sort bar ── */}
        <div className="flex flex-col gap-5 mb-10 pb-8 border-b border-fig-navy/10">
          {/* Category chips */}
          <div className="flex gap-2 flex-wrap">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                className={`font-fig font-semibold text-sm px-5 py-2 rounded-full border-2 transition-all duration-200 ${
                  activeCategory === c
                    ? "bg-fig-terracotta border-fig-terracotta text-fig-navy shadow-lg shadow-fig-terracotta/20"
                    : "border-fig-navy/15 text-fig-ink-soft hover:border-fig-terracotta hover:text-fig-terracotta bg-fig-paper"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Sort + view toggle */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1 border border-fig-navy/15 rounded-xl p-1 bg-fig-paper ml-auto">
              <button
                onClick={() => setGridCols(3)}
                aria-label="Comfortable grid"
                className={`p-1.5 rounded-lg transition-all ${gridCols === 3 ? "bg-fig-terracotta text-fig-navy" : "text-fig-ink-soft hover:text-fig-terracotta"}`}
              >
                <Grid3X3 size={14} />
              </button>
              <button
                onClick={() => setGridCols(4)}
                aria-label="Compact grid"
                className={`p-1.5 rounded-lg transition-all ${gridCols === 4 ? "bg-fig-terracotta text-fig-navy" : "text-fig-ink-soft hover:text-fig-terracotta"}`}
              >
                <LayoutList size={14} />
              </button>
            </div>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="border border-fig-navy/15 bg-fig-paper text-fig-navy px-4 py-2.5 rounded-xl font-fig-body text-sm w-full sm:w-52 focus:outline-none focus:border-fig-terracotta focus:ring-2 focus:ring-fig-terracotta/20 transition-all"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* ── Result count ── */}
        <p className="font-fig-body text-xs text-fig-ink-soft/70 mb-7">
          {loading
            ? "Loading…"
            : `Showing ${filtered.length} of ${products.length} product${products.length !== 1 ? "s" : ""}`
          }
        </p>

        {/* ── Grid — auto-animate applied ── */}
        {loading ? (
          <div className="flex justify-center py-28">
            <Loader2 size={32} className="animate-spin text-fig-terracotta" />
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
            <div className="w-20 h-20 rounded-2xl bg-fig-terracotta/10 flex items-center justify-center mx-auto mb-5">
              <Search size={28} className="text-fig-terracotta/50" />
            </div>
            <p className="font-fig font-bold text-lg text-fig-navy mb-2">No products found</p>
            <p className="font-fig-body text-sm text-fig-ink-soft">Try a different category or search term.</p>
            {search && (
              <button onClick={() => setSearch("")} className="fig-btn-outline mt-5 text-sm">
                Clear search
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
