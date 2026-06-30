"use client";

import { useState } from "react";
import { SlidersHorizontal, Sparkles } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import AnimateIn from "@/components/AnimateIn";
import { products } from "@/lib/products";

const categories = ["All", "Hand Care", "Sun Care"];
const sortOptions = ["Featured", "Price: Low to High", "Price: High to Low", "Top Rated"];

export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [sort, setSort]                     = useState("Featured");
  const [filtersOpen, setFiltersOpen]       = useState(false);

  const filtered = products
    .filter((p) => activeCategory === "All" || p.category === activeCategory)
    .sort((a, b) => {
      if (sort === "Price: Low to High")  return a.price - b.price;
      if (sort === "Price: High to Low")  return b.price - a.price;
      if (sort === "Top Rated")           return b.rating - a.rating;
      return 0;
    });

  return (
    <div className="min-h-screen bg-fluno-light">
      {/* Page header */}
      <div className="bg-fluno-dark relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-fluno-purple/15 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-fluno-purple/8 blur-[100px] rounded-full pointer-events-none" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <p className="eyebrow text-fluno-purple mb-3 flex items-center gap-2">
            <Sparkles size={13} /> The Collection
          </p>
          <h1 className="section-title-white">Shop All Products</h1>
          <p className="section-sub-white">
            {products.length} product{products.length !== 1 ? "s" : ""} —
            formulated with care, priced with honesty.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10 pb-8 border-b border-fluno-lavender">
          <div className="flex gap-2 flex-wrap">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                className={`font-body text-sm px-5 py-2.5 rounded-full border-2 transition-all duration-200 ${
                  activeCategory === c
                    ? "bg-fluno-purple border-fluno-purple text-white shadow-lg shadow-fluno-purple/20"
                    : "border-fluno-lavender text-fluno-muted hover:border-fluno-purple hover:text-fluno-purple"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="sm:ml-auto flex items-center gap-3">
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="btn-ghost text-sm gap-2 border border-fluno-lavender"
            >
              <SlidersHorizontal size={15} /> Filters
            </button>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="input py-2.5 w-full sm:w-52 text-sm"
            >
              {sortOptions.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Count */}
        <p className="font-mono text-xs text-fluno-muted mb-6">
          Showing {filtered.length} product{filtered.length !== 1 ? "s" : ""}
        </p>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
            {filtered.map((p, i) => (
              <AnimateIn key={p.id} delay={i * 0.07}>
                <ProductCard product={p} />
              </AnimateIn>
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <div className="w-16 h-16 rounded-full bg-fluno-purple/10 flex items-center justify-center mx-auto mb-4">
              <Sparkles size={24} className="text-fluno-purple/50" />
            </div>
            <p className="font-body text-fluno-muted">
              No products in this category yet. More launching soon!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
