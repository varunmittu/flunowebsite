"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Loader2, Tag, ToggleLeft, ToggleRight } from "lucide-react";

interface Coupon {
  _id: string; code: string; type: "percent" | "fixed"; value: number;
  minOrder: number; maxUses: number; usedCount: number; active: boolean;
  expiresAt: string | null; createdAt: string;
}

const blank = { code: "", type: "percent" as const, value: "", minOrder: "0", maxUses: "0", expiresAt: "" };

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding]   = useState(false);
  const [saving, setSaving]   = useState(false);
  const [form, setForm]       = useState(blank);
  const set = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }));

  const load = () => fetch("/api/admin/coupons").then(r => r.json()).then(d => { setCoupons(d.coupons ?? []); setLoading(false); });
  useEffect(() => { load(); }, []);

  async function create(e: React.FormEvent) {
    e.preventDefault(); setSaving(true);
    await fetch("/api/admin/coupons", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, value: parseFloat(form.value as string), minOrder: parseFloat(form.minOrder), maxUses: parseInt(form.maxUses), expiresAt: form.expiresAt || null }),
    });
    setForm(blank); setAdding(false); setSaving(false); load();
  }

  async function toggle(id: string, active: boolean) {
    await fetch("/api/admin/coupons", {
      method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, active }),
    });
    load();
  }

  async function del(id: string, code: string) {
    if (!confirm(`Delete coupon "${code}"?`)) return;
    await fetch("/api/admin/coupons", {
      method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }),
    });
    load();
  }

  return (
    <div className="flex-1 p-6 lg:p-10 bg-fluno-light min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl text-fluno-ink">Coupons</h1>
          <p className="font-body text-sm text-fluno-muted mt-0.5">{coupons.length} coupons</p>
        </div>
        <button onClick={() => setAdding(!adding)} className="btn-primary text-sm gap-2"><Plus size={16} /> Add Coupon</button>
      </div>

      {/* Add form */}
      {adding && (
        <form onSubmit={create} className="bg-white rounded-2xl border border-fluno-lavender p-6 mb-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 items-end">
          <div className="lg:col-span-1">
            <label className="block font-body text-xs text-fluno-muted mb-1.5">Code *</label>
            <input value={form.code} onChange={e => set("code", e.target.value.toUpperCase())} className="input text-sm font-mono uppercase" placeholder="FLUNO20" required />
          </div>
          <div>
            <label className="block font-body text-xs text-fluno-muted mb-1.5">Type</label>
            <select value={form.type} onChange={e => set("type", e.target.value)} className="input text-sm">
              <option value="percent">Percent (%)</option>
              <option value="fixed">Fixed (₹)</option>
            </select>
          </div>
          <div>
            <label className="block font-body text-xs text-fluno-muted mb-1.5">Value *</label>
            <input type="number" value={form.value} onChange={e => set("value", e.target.value)} className="input text-sm" placeholder="20" required min="0" step="0.01" />
          </div>
          <div>
            <label className="block font-body text-xs text-fluno-muted mb-1.5">Min Order (₹)</label>
            <input type="number" value={form.minOrder} onChange={e => set("minOrder", e.target.value)} className="input text-sm" min="0" />
          </div>
          <div>
            <label className="block font-body text-xs text-fluno-muted mb-1.5">Max Uses (0=∞)</label>
            <input type="number" value={form.maxUses} onChange={e => set("maxUses", e.target.value)} className="input text-sm" min="0" />
          </div>
          <div>
            <label className="block font-body text-xs text-fluno-muted mb-1.5">Expires At</label>
            <input type="date" value={form.expiresAt} onChange={e => set("expiresAt", e.target.value)} className="input text-sm" />
          </div>
          <div className="col-span-2 md:col-span-3 lg:col-span-6 flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="btn-primary text-sm px-6 py-2.5">
              {saving ? <><Loader2 size={14} className="animate-spin" /> Saving…</> : "Create Coupon"}
            </button>
            <button type="button" onClick={() => setAdding(false)} className="btn-ghost text-sm">Cancel</button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-2xl border border-fluno-lavender overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><Loader2 size={28} className="animate-spin text-fluno-purple" /></div>
        ) : coupons.length === 0 ? (
          <div className="text-center py-16">
            <Tag size={36} className="text-fluno-lavender mx-auto mb-3" />
            <p className="font-body text-sm text-fluno-muted">No coupons yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-fluno-lavender/60 bg-fluno-light/50">
                  {["Code","Type","Value","Min Order","Uses","Expires","Active",""].map(h => (
                    <th key={h} className="px-5 py-3 text-left font-mono text-xs text-fluno-muted/70 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {coupons.map(c => (
                  <tr key={c._id} className="border-b border-fluno-lavender/40 hover:bg-fluno-light/60 transition-colors">
                    <td className="px-5 py-3.5 font-mono font-bold text-fluno-purple text-sm">{c.code}</td>
                    <td className="px-5 py-3.5"><span className="badge text-[10px] capitalize">{c.type}</span></td>
                    <td className="px-5 py-3.5 font-brand font-semibold text-fluno-ink">{c.type === "percent" ? `${c.value}%` : `₹${c.value}`}</td>
                    <td className="px-5 py-3.5 font-body text-fluno-muted">{c.minOrder ? `₹${c.minOrder}` : "—"}</td>
                    <td className="px-5 py-3.5 font-mono text-xs text-fluno-muted">{c.usedCount}/{c.maxUses || "∞"}</td>
                    <td className="px-5 py-3.5 font-mono text-xs text-fluno-muted">{c.expiresAt ? new Date(c.expiresAt).toLocaleDateString("en-IN") : "Never"}</td>
                    <td className="px-5 py-3.5">
                      <button onClick={() => toggle(c._id, !c.active)}>
                        {c.active ? <ToggleRight size={22} className="text-green-500" /> : <ToggleLeft size={22} className="text-gray-400" />}
                      </button>
                    </td>
                    <td className="px-5 py-3.5">
                      <button onClick={() => del(c._id, c.code)} className="p-2 rounded-lg text-fluno-muted hover:text-red-500 hover:bg-red-50 transition-all"><Trash2 size={15} /></button>
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
