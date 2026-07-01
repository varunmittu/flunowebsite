"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Loader2, FileText, ToggleLeft, ToggleRight } from "lucide-react";

interface Post { _id: string; title: string; slug: string; published: boolean; category: string; createdAt: string; author: string; }

export default function AdminBlog() {
  const [posts, setPosts]   = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => fetch("/api/admin/blog").then(r => r.json()).then(d => { setPosts(d.posts ?? []); setLoading(false); });
  useEffect(() => { load(); }, []);

  async function togglePublish(id: string, published: boolean) {
    await fetch(`/api/admin/blog/${id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ published }),
    });
    load();
  }

  async function del(id: string, title: string) {
    if (!confirm(`Delete "${title}"?`)) return;
    await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div className="flex-1 p-6 lg:p-10 bg-fluno-light min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl text-fluno-ink">Blog Posts</h1>
          <p className="font-body text-sm text-fluno-muted mt-0.5">{posts.length} posts</p>
        </div>
        <Link href="/admin/blog/new" className="btn-primary text-sm gap-2"><Plus size={16} /> New Post</Link>
      </div>

      <div className="bg-white rounded-2xl border border-fluno-lavender overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><Loader2 size={28} className="animate-spin text-fluno-purple" /></div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16">
            <FileText size={36} className="text-fluno-lavender mx-auto mb-3" />
            <p className="font-body text-sm text-fluno-muted">No blog posts yet.</p>
            <Link href="/admin/blog/new" className="btn-primary text-sm mt-4 inline-flex">Write your first post</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-fluno-lavender/60 bg-fluno-light/50">
                  {["Title","Category","Author","Published","Date","Actions"].map(h => (
                    <th key={h} className="px-5 py-3 text-left font-mono text-xs text-fluno-muted/70 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {posts.map(p => (
                  <tr key={p._id} className="border-b border-fluno-lavender/40 hover:bg-fluno-light/60 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="font-body font-medium text-fluno-ink">{p.title}</p>
                      <p className="font-mono text-[10px] text-fluno-muted">{p.slug}</p>
                    </td>
                    <td className="px-5 py-3.5"><span className="badge text-[10px]">{p.category || "—"}</span></td>
                    <td className="px-5 py-3.5 font-body text-sm text-fluno-muted">{p.author}</td>
                    <td className="px-5 py-3.5">
                      <button onClick={() => togglePublish(p._id, !p.published)} title="Toggle publish">
                        {p.published ? <ToggleRight size={22} className="text-green-500" /> : <ToggleLeft size={22} className="text-gray-400" />}
                      </button>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-xs text-fluno-muted whitespace-nowrap">{new Date(p.createdAt).toLocaleDateString("en-IN")}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/blog/${p._id}/edit`} className="p-2 rounded-lg text-fluno-muted hover:text-fluno-purple hover:bg-fluno-purple/10 transition-all"><Pencil size={15} /></Link>
                        <button onClick={() => del(p._id, p.title)} className="p-2 rounded-lg text-fluno-muted hover:text-red-500 hover:bg-red-50 transition-all"><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
