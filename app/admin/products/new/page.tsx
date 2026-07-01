"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import ImageUploader from "@/components/admin/ImageUploader";

function toSlug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function ListEditor({ label, items, onChange }: { label: string; items: string[]; onChange: (v: string[]) => void }) {
  const [draft, setDraft] = useState("");
  return (
    <div>
      <label className="block font-body text-xs text-fluno-muted mb-1.5">{label}</label>
      <div className="flex gap-2 mb-2">
        <input
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && draft.trim()) { e.preventDefault(); onChange([...items, draft.trim()]); setDraft(""); }}}
          className="input text-sm flex-1"
          placeholder={`Add ${label.toLowerCase()} and press Enter`}
        />
        <button type="button" onClick={() => { if (draft.trim()) { onChange([...items, draft.trim()]); setDraft(""); }}} className="btn-outline px-3 py-2 text-sm">
          <Plus size={15} />
        </button>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-1.5 bg-fluno-lavender text-fluno-ink text-xs px-3 py-1 rounded-full">
            {item}
            <button type="button" onClick={() => onChange(items.filter((_, j) => j !== i))} className="text-fluno-muted hover:text-red-500">
              <X size={11} />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function NewProduct() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "", slug: "", tagline: "", description: "", price: "", originalPrice: "",
    size: "", category: "", images: [] as string[], ingredients: [] as string[],
    howToUse: [] as string[], benefits: [] as string[], badges: [] as string[],
    inStock: true, featured: false, newArrival: false,
  });

  const set = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (form.images.length === 0) {
      setError("Please upload at least one product image");
      return;
    }
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        price:         parseFloat(form.price) || 0,
        originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : undefined,
      }),
    });

    if (res.ok) {
      router.push("/admin/products");
    } else {
      const d = await res.json();
      setError(d.error || "Failed to create product");
      setLoading(false);
    }
  }

  return (
    <div className="flex-1 p-6 lg:p-10 bg-fluno-light min-h-screen">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/products" className="p-2 rounded-xl text-fluno-muted hover:bg-fluno-lavender transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="font-display text-2xl text-fluno-ink">Add Product</h1>
          <p className="font-body text-sm text-fluno-muted mt-0.5">Fill in the details below</p>
        </div>
      </div>

      <form onSubmit={submit} className="space-y-6 max-w-3xl">
        {error && <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">{error}</div>}

        {/* Basic info */}
        <div className="bg-white rounded-2xl border border-fluno-lavender p-6 space-y-4">
          <h2 className="font-display text-base text-fluno-ink border-b border-fluno-lavender pb-3">Basic Info</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block font-body text-xs text-fluno-muted mb-1.5">Product Name *</label>
              <input
                value={form.name}
                onChange={e => { set("name", e.target.value); set("slug", toSlug(e.target.value)); }}
                className="input" placeholder="Fluno Hand Wash" required
              />
            </div>
            <div>
              <label className="block font-body text-xs text-fluno-muted mb-1.5">Slug *</label>
              <input value={form.slug} onChange={e => set("slug", toSlug(e.target.value))} className="input font-mono text-sm" required />
            </div>
            <div>
              <label className="block font-body text-xs text-fluno-muted mb-1.5">Category</label>
              <input value={form.category} onChange={e => set("category", e.target.value)} className="input" placeholder="Hand Care" />
            </div>
            <div className="col-span-2">
              <label className="block font-body text-xs text-fluno-muted mb-1.5">Tagline</label>
              <input value={form.tagline} onChange={e => set("tagline", e.target.value)} className="input" placeholder="Short product tagline" />
            </div>
            <div className="col-span-2">
              <label className="block font-body text-xs text-fluno-muted mb-1.5">Description</label>
              <textarea value={form.description} onChange={e => set("description", e.target.value)} className="input min-h-[100px] resize-y" placeholder="Product description..." />
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-2xl border border-fluno-lavender p-6 space-y-4">
          <h2 className="font-display text-base text-fluno-ink border-b border-fluno-lavender pb-3">Pricing & Size</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block font-body text-xs text-fluno-muted mb-1.5">Price (₹) *</label>
              <input type="number" value={form.price} onChange={e => set("price", e.target.value)} className="input" placeholder="80" required min="0" step="0.01" />
            </div>
            <div>
              <label className="block font-body text-xs text-fluno-muted mb-1.5">Original Price (₹)</label>
              <input type="number" value={form.originalPrice} onChange={e => set("originalPrice", e.target.value)} className="input" placeholder="120" min="0" step="0.01" />
            </div>
            <div>
              <label className="block font-body text-xs text-fluno-muted mb-1.5">Size</label>
              <input value={form.size} onChange={e => set("size", e.target.value)} className="input" placeholder="250ml" />
            </div>
          </div>
        </div>

        {/* Images — Google Drive upload */}
        <div className="bg-white rounded-2xl border border-fluno-lavender p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-fluno-lavender pb-3">
            <h2 className="font-display text-base text-fluno-ink">Product Images</h2>
            <span className="font-mono text-xs text-fluno-muted">{form.images.filter(Boolean).length} / 4 uploaded</span>
          </div>
          <ImageUploader
            images={form.images}
            onChange={imgs => set("images", imgs)}
            count={4}
          />
        </div>

        {/* Details */}
        <div className="bg-white rounded-2xl border border-fluno-lavender p-6 space-y-5">
          <h2 className="font-display text-base text-fluno-ink border-b border-fluno-lavender pb-3">Product Details</h2>
          <ListEditor label="Ingredients"  items={form.ingredients} onChange={v => set("ingredients", v)} />
          <ListEditor label="How to Use"   items={form.howToUse}    onChange={v => set("howToUse", v)}    />
          <ListEditor label="Benefits"     items={form.benefits}    onChange={v => set("benefits", v)}    />
          <ListEditor label="Badges/Tags"  items={form.badges}      onChange={v => set("badges", v)}      />
        </div>

        {/* Flags */}
        <div className="bg-white rounded-2xl border border-fluno-lavender p-6">
          <h2 className="font-display text-base text-fluno-ink border-b border-fluno-lavender pb-3 mb-4">Settings</h2>
          <div className="grid grid-cols-3 gap-4">
            {([
              ["inStock",    "In Stock",    "Mark product as available"],
              ["featured",   "Featured",    "Show on homepage"],
              ["newArrival", "New Arrival", "Show 'New' badge"],
            ] as [keyof typeof form, string, string][]).map(([key, label, desc]) => (
              <label key={key} className="flex items-start gap-3 cursor-pointer p-3 rounded-xl border border-fluno-lavender/60 hover:bg-fluno-light transition-colors">
                <input
                  type="checkbox"
                  checked={!!form[key]}
                  onChange={e => set(key, e.target.checked)}
                  className="mt-0.5 accent-fluno-purple w-4 h-4"
                />
                <div>
                  <p className="font-body text-sm font-medium text-fluno-ink">{label}</p>
                  <p className="font-mono text-[10px] text-fluno-muted">{desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button type="submit" disabled={loading} className="btn-primary px-8 py-3">
            {loading ? <><Loader2 size={16} className="animate-spin" /> Saving…</> : "Save Product"}
          </button>
          <Link href="/admin/products" className="btn-ghost">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
