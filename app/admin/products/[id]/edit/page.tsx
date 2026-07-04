"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Plus, X, Loader2, ArrowLeft, AlertCircle } from "lucide-react";
import Link from "next/link";
import ImageUploader from "@/components/admin/ImageUploader";

function toSlug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const PANEL    = { background: "rgba(255,255,255,0.04)" };
const inputCls = "w-full bg-white/[0.06] border border-white/[0.1] text-white text-sm rounded-xl px-3.5 py-2.5 placeholder:text-white/20 focus:outline-none focus:border-fig-terracotta/50 transition-colors font-fig-body";
const labelCls = "block font-mono text-[10px] text-white/35 uppercase tracking-wider mb-1.5";

function ListEditor({ label, items, onChange }: { label: string; items: string[]; onChange: (v: string[]) => void }) {
  const [draft, setDraft] = useState("");
  return (
    <div>
      <label className={labelCls}>{label}</label>
      <div className="flex gap-2 mb-2.5">
        <input
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter" && draft.trim()) {
              e.preventDefault();
              onChange([...items, draft.trim()]);
              setDraft("");
            }
          }}
          className={inputCls}
          placeholder={`Add ${label.toLowerCase()} and press Enter`}
        />
        <button
          type="button"
          onClick={() => { if (draft.trim()) { onChange([...items, draft.trim()]); setDraft(""); } }}
          className="flex-shrink-0 border border-white/[0.1] text-white/40 hover:text-white hover:border-white/25 px-3 py-2.5 rounded-xl transition-all"
        >
          <Plus size={14} />
        </button>
      </div>
      {items.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {items.map((item, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1.5 bg-white/[0.07] text-white/65 text-xs px-3 py-1 rounded-full"
            >
              {item}
              <button
                type="button"
                onClick={() => onChange(items.filter((_, j) => j !== i))}
                className="text-white/30 hover:text-red-400 transition-colors"
              >
                <X size={10} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function EditProduct() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [loading,  setLoading]  = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error,    setError]    = useState("");
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/admin/categories")
      .then(r => r.json())
      .then(d => setCategories(
        (d.categories ?? [])
          .filter((c: { active?: boolean }) => c.active !== false)
          .map((c: { name: string }) => c.name)
          .filter(Boolean)
      ))
      .catch(() => {});
  }, []);

  const [form, setForm] = useState({
    name: "", slug: "", tagline: "", description: "", price: "", originalPrice: "",
    size: "", category: "", images: [] as string[], ingredients: [] as string[],
    howToUse: [] as string[], benefits: [] as string[], badges: [] as string[],
    inStock: true, featured: false, newArrival: false,
  });

  useEffect(() => {
    fetch(`/api/admin/products/${id}`).then(r => r.json()).then(d => {
      const p = d.product;
      setForm({
        name:          p.name          ?? "",
        slug:          p.slug          ?? "",
        tagline:       p.tagline       ?? "",
        description:   p.description   ?? "",
        price:         String(p.price  ?? ""),
        originalPrice: p.originalPrice ? String(p.originalPrice) : "",
        size:          p.size          ?? "",
        category:      p.category      ?? "",
        images:        p.images        ?? [],
        ingredients:   p.ingredients   ?? [],
        howToUse:      p.howToUse      ?? [],
        benefits:      p.benefits      ?? [],
        badges:        p.badges        ?? [],
        inStock:       p.inStock       ?? true,
        featured:      p.featured      ?? false,
        newArrival:    p.newArrival    ?? false,
      });
      setFetching(false);
    });
  }, [id]);

  const set = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (form.images.length === 0) { setError("Please upload at least one product image"); return; }
    setLoading(true); setError("");

    const res = await fetch(`/api/admin/products/${id}`, {
      method:  "PUT",
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
      setError(d.error || "Failed to update product");
      setLoading(false);
    }
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-56px)]">
        <Loader2 size={26} className="animate-spin text-fig-terracotta/60" />
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 lg:p-8 min-h-screen">

      {/* Header */}
      <div className="flex items-center gap-4 mb-7">
        <Link
          href="/admin/products"
          className="p-2 rounded-xl text-white/30 hover:text-white/70 hover:bg-white/[0.06] transition-all"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <p className="font-mono text-[9px] text-fig-terracotta/45 tracking-[0.22em] uppercase mb-0.5">
            Products
          </p>
          <h1 className="font-fig font-bold text-xl text-white">Edit Product</h1>
          <p className="font-fig-body text-sm text-white/35 mt-0.5 truncate max-w-xs">{form.name}</p>
        </div>
      </div>

      <form onSubmit={submit} className="space-y-5 max-w-3xl">

        {/* Error */}
        {error && (
          <div
            className="flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm text-red-300 border border-red-500/20"
            style={{ background: "rgba(239,68,68,0.08)" }}
          >
            <AlertCircle size={15} className="flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Basic Info */}
        <div className="rounded-2xl border border-white/[0.07] p-6 space-y-4" style={PANEL}>
          <h2 className="font-fig font-bold text-sm font-semibold text-white border-b border-white/[0.06] pb-3">
            Basic Info
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className={labelCls}>Product Name *</label>
              <input
                value={form.name}
                onChange={e => { set("name", e.target.value); set("slug", toSlug(e.target.value)); }}
                className={inputCls}
                required
              />
            </div>
            <div>
              <label className={labelCls}>Slug</label>
              <input
                value={form.slug}
                onChange={e => set("slug", toSlug(e.target.value))}
                className={inputCls + " font-mono"}
              />
            </div>
            <div>
              <label className={labelCls}>Category</label>
              <select
                value={form.category}
                onChange={e => set("category", e.target.value)}
                className={inputCls}
              >
                <option value="">— Select category —</option>
                {/* keep the product's current category selectable even if it's inactive/removed */}
                {form.category && !categories.includes(form.category) && (
                  <option value={form.category}>{form.category} (current)</option>
                )}
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <label className={labelCls}>Tagline</label>
              <input
                value={form.tagline}
                onChange={e => set("tagline", e.target.value)}
                className={inputCls}
              />
            </div>
            <div className="col-span-2">
              <label className={labelCls}>Description</label>
              <textarea
                value={form.description}
                onChange={e => set("description", e.target.value)}
                className={inputCls + " min-h-[90px] resize-y"}
              />
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="rounded-2xl border border-white/[0.07] p-6 space-y-4" style={PANEL}>
          <h2 className="font-fig font-bold text-sm font-semibold text-white border-b border-white/[0.06] pb-3">
            Pricing & Size
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Price (₹) *</label>
              <input
                type="number" value={form.price}
                onChange={e => set("price", e.target.value)}
                className={inputCls}
                required min="0" step="0.01"
              />
            </div>
            <div>
              <label className={labelCls}>Original Price (₹)</label>
              <input
                type="number" value={form.originalPrice}
                onChange={e => set("originalPrice", e.target.value)}
                className={inputCls}
                min="0" step="0.01"
              />
            </div>
            <div>
              <label className={labelCls}>Size</label>
              <input
                value={form.size}
                onChange={e => set("size", e.target.value)}
                className={inputCls}
              />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="rounded-2xl border border-white/[0.07] p-6 space-y-4" style={PANEL}>
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
            <h2 className="font-fig font-bold text-sm font-semibold text-white">Product Images</h2>
            <span className="font-mono text-[10px] text-white/30">
              {form.images.filter(Boolean).length} / 4 uploaded
            </span>
          </div>
          <ImageUploader
            images={form.images}
            onChange={imgs => set("images", imgs)}
            count={4}
          />
        </div>

        {/* Details */}
        <div className="rounded-2xl border border-white/[0.07] p-6 space-y-5" style={PANEL}>
          <h2 className="font-fig font-bold text-sm font-semibold text-white border-b border-white/[0.06] pb-3">
            Product Details
          </h2>
          <ListEditor label="Ingredients"   items={form.ingredients} onChange={v => set("ingredients", v)} />
          <ListEditor label="How to Use"    items={form.howToUse}    onChange={v => set("howToUse", v)}    />
          <ListEditor label="Benefits"      items={form.benefits}    onChange={v => set("benefits", v)}    />
          <ListEditor label="Badges / Tags" items={form.badges}      onChange={v => set("badges", v)}      />
        </div>

        {/* Settings */}
        <div className="rounded-2xl border border-white/[0.07] p-6" style={PANEL}>
          <h2 className="font-fig font-bold text-sm font-semibold text-white border-b border-white/[0.06] pb-3 mb-4">
            Settings
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {([
              ["inStock",    "In Stock",    "Mark as available to buy"],
              ["featured",   "Featured",    "Show on homepage"],
              ["newArrival", "New Arrival", "Display 'New' badge"],
            ] as [keyof typeof form, string, string][]).map(([key, label, desc]) => (
              <label
                key={key}
                className="flex items-start gap-3 cursor-pointer p-3.5 rounded-xl border border-white/[0.08] hover:bg-white/[0.04] hover:border-white/[0.14] transition-all"
              >
                <input
                  type="checkbox"
                  checked={!!form[key]}
                  onChange={e => set(key, e.target.checked)}
                  className="mt-0.5 accent-fig-terracotta w-4 h-4 flex-shrink-0"
                />
                <div>
                  <p className="font-fig-body text-sm font-medium text-white/80">{label}</p>
                  <p className="font-mono text-[10px] text-white/30 mt-0.5">{desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pb-8">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary px-8 py-3"
          >
            {loading
              ? <><Loader2 size={15} className="animate-spin" /> Saving…</>
              : "Save Changes"}
          </button>
          <Link
            href="/admin/products"
            className="px-4 py-2 text-sm text-white/40 hover:text-white/70 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
