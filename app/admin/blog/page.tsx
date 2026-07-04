"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Loader2, FileText, ToggleLeft, ToggleRight } from "lucide-react";

interface Post {
  _id: string; title: string; slug: string; published: boolean;
  category: string; createdAt: string; author: string;
}

const PANEL = { background: "rgba(255,255,255,0.04)" };

export default function AdminBlog() {
  const [posts,   setPosts]   = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () =>
    fetch("/api/admin/blog").then(r => r.json()).then(d => {
      setPosts(d.posts ?? []); setLoading(false);
    });

  useEffect(() => { load(); }, []);

  async function togglePublish(id: string, published: boolean) {
    await fetch(`/api/admin/blog/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published }),
    });
    load();
  }

  async function del(id: string, title: string) {
    if (!confirm(`Delete "${title}"?`)) return;
    await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div className="flex-1 p-6 lg:p-8 min-h-screen">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="font-mono text-[9px] text-fig-terracotta/45 tracking-[0.22em] uppercase mb-1">Content</p>
          <h1 className="font-fig font-bold text-2xl text-white">Blog Posts</h1>
          <p className="font-fig-body text-sm text-white/35 mt-0.5">{posts.length} posts</p>
        </div>
        <Link href="/admin/blog/new" className="btn-primary text-sm gap-2">
          <Plus size={15} /> New Post
        </Link>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-white/[0.07] overflow-hidden" style={PANEL}>
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 size={26} className="animate-spin text-fig-terracotta/60" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16">
            <FileText size={32} className="text-white/[0.12] mx-auto mb-3" />
            <p className="font-fig font-bold text-white/70">No blog posts yet</p>
            <p className="font-fig-body text-sm text-white/30 mt-1 mb-4">Share a story or a skincare tip to get started.</p>
            <Link href="/admin/blog/new" className="btn-primary text-sm inline-flex">
              Write your first post
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr
                  className="border-b border-white/[0.05]"
                  style={{ background: "rgba(255,255,255,0.025)" }}
                >
                  {["Title","Category","Author","Published","Date","Actions"].map(h => (
                    <th
                      key={h}
                      className="px-5 py-3 text-left font-mono text-[9px] text-white/25 uppercase tracking-widest whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {posts.map(p => (
                  <tr
                    key={p._id}
                    className="border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors last:border-b-0"
                  >
                    <td className="px-5 py-3.5 max-w-xs">
                      <p className="font-fig-body font-medium text-white/85 truncate">{p.title}</p>
                      <p className="font-mono text-[10px] text-white/30 truncate">{p.slug}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-block font-mono text-[10px] px-2 py-0.5 rounded-full bg-white/[0.07] text-white/45">
                        {p.category || "—"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-fig-body text-sm text-white/45">
                      {p.author}
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => togglePublish(p._id, !p.published)}
                        title="Toggle publish"
                        className="flex"
                      >
                        {p.published
                          ? <ToggleRight size={22} className="text-green-400" />
                          : <ToggleLeft  size={22} className="text-white/20"  />}
                      </button>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-xs text-white/30 whitespace-nowrap">
                      {new Date(p.createdAt).toLocaleDateString("en-IN")}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1">
                        <Link
                          href={`/admin/blog/${p._id}/edit`}
                          className="p-2 rounded-lg text-white/30 hover:text-fig-terracotta hover:bg-fig-terracotta/10 transition-all"
                        >
                          <Pencil size={14} />
                        </Link>
                        <button
                          onClick={() => del(p._id, p.title)}
                          className="p-2 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/[0.08] transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
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
