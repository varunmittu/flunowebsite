"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Loader2, FolderOpen, Check, X, ToggleLeft, ToggleRight } from "lucide-react";

interface Category {
  _id: string; name: string; slug: string; description: string;
  image: string; order: number; active: boolean;
}

function toSlug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const blank = { name: "", slug: "", description: "", image: "", order: "0" };

const PANEL   = { background: "rgba(255,255,255,0.04)"  };
const FORM_BG = { background: "rgba(255,255,255,0.035)" };

const inputCls = "w-full bg-white/[0.06] border border-white/[0.1] text-white text-sm rounded-xl px-3 py-2.5 placeholder:text-white/25 focus:outline-none focus:border-fig-terracotta/50 transition-colors font-fig-body";
const labelCls = "block font-mono text-[10px] text-white/35 uppercase tracking-wider mb-1.5";

export default function AdminCategories() {
  const [cats,    setCats]    = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding,  setAdding]  = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form,    setForm]    = useState(blank);
  const [saving,  setSaving]  = useState(false);
  const set = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }));

  const load = () =>
    fetch("/api/admin/categories").then(r => r.json()).then(d => {
      setCats(d.categories ?? []); setLoading(false);
    });

  useEffect(() => { load(); }, []);

  async function create(e: React.FormEvent) {
    e.preventDefault(); setSaving(true);
    await fetch("/api/admin/categories", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, order: parseInt(form.order) }),
    });
    setForm(blank); setAdding(false); setSaving(false); load();
  }

  async function save(e: React.FormEvent) {
    e.preventDefault(); if (!editing) return; setSaving(true);
    await fetch("/api/admin/categories", {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: editing._id, ...form, order: parseInt(form.order) }),
    });
    setEditing(null); setForm(blank); setSaving(false); load();
  }

  async function del(id: string, name: string) {
    if (!confirm(`Delete category "${name}"?`)) return;
    await fetch("/api/admin/categories", {
      method: "DELETE", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    load();
  }

  async function toggle(id: string, active: boolean) {
    await fetch("/api/admin/categories", {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, active }),
    });
    load();
  }

  function startEdit(c: Category) {
    setEditing(c);
    setForm({ name: c.name, slug: c.slug, description: c.description || "", image: c.image || "", order: String(c.order) });
    setAdding(false);
  }

  function cancelForm() {
    setAdding(false); setEditing(null); setForm(blank);
  }

  const FormRow = ({ onSubmit, isEdit = false }: { onSubmit: (e: React.FormEvent) => void; isEdit?: boolean }) => (
    <div className="rounded-2xl border border-white/[0.08] p-5 mb-5" style={FORM_BG}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-fig font-bold text-sm font-semibold text-white">
          {isEdit ? "Edit Category" : "New Category"}
        </h3>
        <button
          type="button"
          onClick={cancelForm}
          className="p-1.5 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/[0.06] transition-all"
        >
          <X size={14} />
        </button>
      </div>
      <form onSubmit={onSubmit} className="grid grid-cols-2 md:grid-cols-4 gap-3 items-end">
        <div>
          <label className={labelCls}>Name *</label>
          <input
            value={form.name}
            onChange={e => { set("name", e.target.value); if (!isEdit) set("slug", toSlug(e.target.value)); }}
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
          <label className={labelCls}>Order</label>
          <input
            type="number"
            value={form.order}
            onChange={e => set("order", e.target.value)}
            className={inputCls}
            min="0"
          />
        </div>
        <div>
          <label className={labelCls}>Image URL</label>
          <input
            value={form.image}
            onChange={e => set("image", e.target.value)}
            className={inputCls}
            placeholder="https://…"
          />
        </div>
        <div className="col-span-2 md:col-span-4">
          <label className={labelCls}>Description</label>
          <input
            value={form.description}
            onChange={e => set("description", e.target.value)}
            className={inputCls}
          />
        </div>
        <div className="col-span-2 md:col-span-4 flex gap-3 pt-1">
          <button type="submit" disabled={saving} className="btn-primary text-sm px-5">
            {saving
              ? <><Loader2 size={13} className="animate-spin" /> Saving…</>
              : isEdit
                ? <><Check size={13} /> Update</>
                : <><Plus size={13} /> Create</>}
          </button>
          <button
            type="button"
            onClick={cancelForm}
            className="px-4 text-sm text-white/40 hover:text-white/70 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="flex-1 p-6 lg:p-8 min-h-screen">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="font-mono text-[9px] text-fig-terracotta/45 tracking-[0.22em] uppercase mb-1">Content</p>
          <h1 className="font-fig font-bold text-2xl text-white">Categories</h1>
          <p className="font-fig-body text-sm text-white/35 mt-0.5">{cats.length} categories</p>
        </div>
        <button
          onClick={() => { setAdding(!adding); setEditing(null); setForm(blank); }}
          className="btn-primary text-sm gap-2"
        >
          <Plus size={15} /> Add Category
        </button>
      </div>

      {/* Rendered as a function call (not <FormRow/>) so typing doesn't remount
          the form and steal focus from the inputs. */}
      {adding  && FormRow({ onSubmit: create })}
      {editing && FormRow({ onSubmit: save, isEdit: true })}

      {/* Table */}
      <div className="rounded-2xl border border-white/[0.07] overflow-hidden" style={PANEL}>
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 size={26} className="animate-spin text-fig-terracotta/60" />
          </div>
        ) : cats.length === 0 ? (
          <div className="text-center py-16">
            <FolderOpen size={32} className="text-white/[0.12] mx-auto mb-3" />
            <p className="font-fig font-bold text-white/70">No categories yet</p>
            <p className="font-fig-body text-sm text-white/30 mt-1">Group your products to help shoppers browse.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr
                  className="border-b border-white/[0.05]"
                  style={{ background: "rgba(255,255,255,0.025)" }}
                >
                  {["Name","Slug","Order","Active","Actions"].map(h => (
                    <th
                      key={h}
                      className="px-5 py-3 text-left font-mono text-[9px] text-white/25 uppercase tracking-widest"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cats.map(c => (
                  <tr
                    key={c._id}
                    className="border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors last:border-b-0"
                  >
                    <td className="px-5 py-3.5 font-fig-body font-medium text-white/85">{c.name}</td>
                    <td className="px-5 py-3.5 font-mono text-xs text-white/35">{c.slug}</td>
                    <td className="px-5 py-3.5 font-mono text-xs text-white/35">{c.order}</td>
                    <td className="px-5 py-3.5">
                      <button onClick={() => toggle(c._id, !c.active)} className="flex">
                        {c.active
                          ? <ToggleRight size={22} className="text-green-400" />
                          : <ToggleLeft  size={22} className="text-white/20"  />}
                      </button>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => startEdit(c)}
                          className="p-2 rounded-lg text-white/30 hover:text-fig-terracotta hover:bg-fig-terracotta/10 transition-all"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => del(c._id, c.name)}
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
