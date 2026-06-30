import type { Metadata } from "next";
import ProductCard from "@/components/ProductCard";
import { products } from "@/lib/products";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Browse all Fluno personal care products — hand wash, sunscreen, and more.",
};

const categories = ["All", "Hand Care", "Sun Care"];

export default function ShopPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      {/* Header */}
      <div className="mb-10">
        <p className="font-mono text-xs tracking-widest text-fluno-teal uppercase mb-2">
          The Collection
        </p>
        <h1 className="section-title">Shop All Products</h1>
        <p className="section-sub">
          {products.length} product{products.length !== 1 ? "s" : ""} —
          formulated with care, priced with honesty.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8 pb-8 border-b border-fluno-stone/40">
        <div className="flex gap-2 flex-wrap">
          {categories.map((c) => (
            <button
              key={c}
              className="font-body text-sm px-4 py-2 rounded-sm border border-fluno-stone hover:border-fluno-teal hover:text-fluno-teal transition-colors first:bg-fluno-teal first:text-white first:border-fluno-teal"
            >
              {c}
            </button>
          ))}
        </div>
        <div className="sm:ml-auto">
          <select className="input py-2 w-full sm:w-48 text-sm">
            <option>Sort: Featured</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Rating</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-20">
          <p className="font-body text-fluno-ink/50">
            More products launching soon. Subscribe to get notified.
          </p>
        </div>
      )}
    </div>
  );
}
