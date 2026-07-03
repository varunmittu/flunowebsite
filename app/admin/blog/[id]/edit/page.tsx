"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

function toSlug(s: string) { return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""); }

export default function EditBlogPost() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError]   = useState("");
  const [form, setForm] = useState({
    title: "", slug: "", excerpt: "", content: "", coverImage: "",
    category: "", author: "Fluno Team", published: false, readTime: "",
  });
  const set = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }));

  useEffect(() => {
    fetch(`/api/admin/blog/${id}`).then(r => r.json()).then(d => {
      const p = d.post;
      setForm({
        title: p.title ?? "", slug: p.slug ?? "", excerpt: p.excerpt ?? "",
        content: p.content ?? "", coverImage: p.coverImage ?? "",
        category: p.category ?? "", author: p.author ?? "Fluno Team",
        published: p.published ?? false, readTime: p.readTime ?? "",
      });
      setFetching(false);
    });
  }, [id]);

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); setError("");
    const res = await fetch(`/api/admin/blog/${id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form),
    });
    if (res.ok) { router.push("/admin/blog"); }
    else { const d = await res.json(); setError(d.error || "Failed"); setLoading(false); }
  }

  if (fetching) return <div className="flex-1 flex items-center justify-center min-h-screen bg-fig-cream"><Loader2 size={28} className="animate-spin text-fig-terracotta" /></div>;

  return (
    <div className="flex-1 p-6 lg:p-10 bg-fig-cream min-h-screen">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/blog" className="p-2 rounded-xl text-fig-ink-soft hover:bg-fig-sage transition-colors"><ArrowLeft size={20} /></Link>
        <div>
          <h1 className="font-fig font-bold text-2xl text-fig-navy">Edit Post</h1>
          <p className="font-fig-body text-sm text-fig-ink-soft mt-0.5">{form.title}</p>
        </div>
      </div>

      <form onSubmit={submit} className="space-y-6 max-w-3xl">
        {error && <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">{error}</div>}

        <div className="bg-white rounded-2xl border border-fig-sage p-6 space-y-4">
          <h2 className="font-fig font-bold text-base text-fig-navy border-b border-fig-sage pb-3">Post Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2"><label className="block font-fig-body text-xs text-fig-ink-soft mb-1.5">Title *</label>
              <input value={form.title} onChange={e => set("title", e.target.value)} className="input text-lg font-fig font-bold" required /></div>
            <div><label className="block font-fig-body text-xs text-fig-ink-soft mb-1.5">Slug</label>
              <input value={form.slug} onChange={e => set("slug", toSlug(e.target.value))} className="input font-mono text-sm" /></div>
            <div><label className="block font-fig-body text-xs text-fig-ink-soft mb-1.5">Category</label>
              <input value={form.category} onChange={e => set("category", e.target.value)} className="input" /></div>
            <div><label className="block font-fig-body text-xs text-fig-ink-soft mb-1.5">Author</label>
              <input value={form.author} onChange={e => set("author", e.target.value)} className="input" /></div>
            <div><label className="block font-fig-body text-xs text-fig-ink-soft mb-1.5">Read Time</label>
              <input value={form.readTime} onChange={e => set("readTime", e.target.value)} className="input" /></div>
            <div className="col-span-2"><label className="block font-fig-body text-xs text-fig-ink-soft mb-1.5">Cover Image URL</label>
              <input type="url" value={form.coverImage} onChange={e => set("coverImage", e.target.value)} className="input" /></div>
            <div className="col-span-2"><label className="block font-fig-body text-xs text-fig-ink-soft mb-1.5">Excerpt</label>
              <textarea value={form.excerpt} onChange={e => set("excerpt", e.target.value)} className="input resize-y min-h-[80px]" /></div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-fig-sage p-6">
          <label className="block font-fig font-bold text-base text-fig-navy border-b border-fig-sage pb-3 mb-4">Content</label>
          <textarea value={form.content} onChange={e => set("content", e.target.value)} className="input resize-y min-h-[350px] font-mono text-sm" />
          <p className="font-mono text-[10px] text-fig-ink-soft mt-2">HTML is supported</p>
        </div>

        <div className="bg-white rounded-2xl border border-fig-sage p-5">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={form.published} onChange={e => set("published", e.target.checked)} className="accent-fig-terracotta w-4 h-4" />
            <div><p className="font-fig-body text-sm font-medium text-fig-navy">Published</p>
              <p className="font-mono text-[10px] text-fig-ink-soft">Post is visible on the blog</p></div>
          </label>
        </div>

        <div className="flex items-center gap-3">
          <button type="submit" disabled={loading} className="btn-primary px-8 py-3">
            {loading ? <><Loader2 size={16} className="animate-spin" /> Saving…</> : "Save Changes"}
          </button>
          <Link href="/admin/blog" className="btn-ghost">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
