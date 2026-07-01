"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

function toSlug(s: string) { return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""); }

export default function NewBlogPost() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [form, setForm] = useState({
    title: "", slug: "", excerpt: "", content: "", coverImage: "",
    category: "", author: "Fluno Team", published: false, readTime: "",
  });
  const set = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); setError("");
    const res = await fetch("/api/admin/blog", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form),
    });
    if (res.ok) { router.push("/admin/blog"); }
    else { const d = await res.json(); setError(d.error || "Failed"); setLoading(false); }
  }

  return (
    <div className="flex-1 p-6 lg:p-10 bg-fluno-light min-h-screen">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/blog" className="p-2 rounded-xl text-fluno-muted hover:bg-fluno-lavender transition-colors"><ArrowLeft size={20} /></Link>
        <h1 className="font-display text-2xl text-fluno-ink">New Blog Post</h1>
      </div>

      <form onSubmit={submit} className="space-y-6 max-w-3xl">
        {error && <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">{error}</div>}

        <div className="bg-white rounded-2xl border border-fluno-lavender p-6 space-y-4">
          <h2 className="font-display text-base text-fluno-ink border-b border-fluno-lavender pb-3">Post Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block font-body text-xs text-fluno-muted mb-1.5">Title *</label>
              <input value={form.title} onChange={e => { set("title", e.target.value); set("slug", toSlug(e.target.value)); }} className="input text-lg font-display" placeholder="Post title..." required />
            </div>
            <div>
              <label className="block font-body text-xs text-fluno-muted mb-1.5">Slug *</label>
              <input value={form.slug} onChange={e => set("slug", toSlug(e.target.value))} className="input font-mono text-sm" required />
            </div>
            <div>
              <label className="block font-body text-xs text-fluno-muted mb-1.5">Category</label>
              <input value={form.category} onChange={e => set("category", e.target.value)} className="input" placeholder="Skincare / Sunscreen / etc." />
            </div>
            <div>
              <label className="block font-body text-xs text-fluno-muted mb-1.5">Author</label>
              <input value={form.author} onChange={e => set("author", e.target.value)} className="input" />
            </div>
            <div>
              <label className="block font-body text-xs text-fluno-muted mb-1.5">Read Time</label>
              <input value={form.readTime} onChange={e => set("readTime", e.target.value)} className="input" placeholder="5 min read" />
            </div>
            <div className="col-span-2">
              <label className="block font-body text-xs text-fluno-muted mb-1.5">Cover Image URL</label>
              <input type="url" value={form.coverImage} onChange={e => set("coverImage", e.target.value)} className="input" placeholder="https://..." />
            </div>
            <div className="col-span-2">
              <label className="block font-body text-xs text-fluno-muted mb-1.5">Excerpt</label>
              <textarea value={form.excerpt} onChange={e => set("excerpt", e.target.value)} className="input resize-y min-h-[80px]" placeholder="Short summary shown in the blog list..." />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-fluno-lavender p-6">
          <label className="block font-display text-base text-fluno-ink border-b border-fluno-lavender pb-3 mb-4">Content</label>
          <textarea
            value={form.content}
            onChange={e => set("content", e.target.value)}
            className="input resize-y min-h-[350px] font-mono text-sm"
            placeholder="Write your blog post content here..."
          />
          <p className="font-mono text-[10px] text-fluno-muted mt-2">HTML is supported</p>
        </div>

        <div className="bg-white rounded-2xl border border-fluno-lavender p-5">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={form.published} onChange={e => set("published", e.target.checked)} className="accent-fluno-purple w-4 h-4" />
            <div>
              <p className="font-body text-sm font-medium text-fluno-ink">Publish immediately</p>
              <p className="font-mono text-[10px] text-fluno-muted">Post will be visible on the blog</p>
            </div>
          </label>
        </div>

        <div className="flex items-center gap-3">
          <button type="submit" disabled={loading} className="btn-primary px-8 py-3">
            {loading ? <><Loader2 size={16} className="animate-spin" /> Saving…</> : "Save Post"}
          </button>
          <Link href="/admin/blog" className="btn-ghost">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
