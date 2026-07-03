"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Loader2, Tag, ToggleLeft, ToggleRight, X } from "lucide-react";

interface Coupon {
  _id: string; code: string; type: "percent" | "fixed"; value: number;
  minOrder: number; maxUses: number; usedCount: number; active: boolean;
  expiresAt: string | null; createdAt: string;
}

const blank = { code: "", type: "percent" as const, value: "", minOrder: "0", maxUses: "0", expiresAt: "" };

const PANEL  = { background: "rgba(255,255,255,0.04)"  };
const FORM_BG = { background: "rgba(255,255,255,0.035)" };

const inputCls = "w-full bg-white/[0.06] border border-white/[0.1] text-white text-sm rounded-xl px-3 py-2.5 placeholder:text-white/25 focus:outline-none focus:border-fig-terracotta/50 transition-colors font-fig-body";
const labelCls = "block font-mono text-[10px] text-white/35 uppercase tracking-wider mb-1.5";

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding,  setAdding]  = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [form,    setForm]    = useState(blank);
  const set = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }));

  const load = () =>
    fetch("/api/admin/coupons").then(r => r.json()).then(d => {
      setCoupons(d.coupons ?? []); setLoading(false);
    });

  useEffect(() => { load(); }, []);

  async function create(e: React.FormEvent) {
    e.preventDefault(); setSaving(true);
    await fetch("/api/admin/coupons", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        value: parseFloat(form.value as string),
        minOrder: parseFloat(form.minOrder),
        maxUses: parseInt(form.maxUses),
        expiresAt: form.expiresAt || null,
      }),
    });
    setForm(blank); setAdding(false); setSaving(false); load();
  }

  async function toggle(id: string, active: boolean) {
    await fetch("/api/admin/coupons", {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, active }),
    });
    load();
  }

  async function del(id: string, code: string) {
    if (!confirm(`Delete coupon "${code}"?`)) return;
    await fetch("/api/admin/coupons", {
      method: "DELETE", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    load();
  }

  return (
    <div className="flex-1 p-6 lg:p-8 min-h-screen">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="font-mono text-[9px] text-fig-terracotta/45 tracking-[0.22em] uppercase mb-1">Content</p>
          <h1 className="font-fig font-bold text-2xl text-white">Coupons</h1>
          <p className="font-fig-body text-sm text-white/35 mt-0.5">{coupons.length} coupons</p>
        </div>
        <button
          onClick={() => setAdding(!adding)}
          className="btn-primary text-sm gap-2"
        >
          <Plus size={15} /> Add Coupon
        </button>
      </div>

      {/* Add form */}
      {adding && (
        <div
          className="rounded-2xl border border-white/[0.08] p-5 mb-5"
          style={FORM_BG}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-fig font-bold text-sm font-semibold text-white">New Coupon</h3>
            <button
              onClick={() => setAdding(false)}
              className="p-1.5 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/[0.06] transition-all"
            >
              <X size={14} />
            </button>
          </div>
          <form onSubmit={create} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 items-end">
            <div className="lg:col-span-1">
              <label className={labelCls}>Code *</label>
              <input
                value={form.code}
                onChange={e => set("code", e.target.value.toUpperCase())}
                className={inputCls + " font-mono uppercase"}
                placeholder="FLUNO20"
                required
              />
            </div>
            <div>
              <label className={labelCls}>Type</label>
              <select
                value={form.type}
                onChange={e => set("type", e.target.value)}
                className={inputCls}
              >
                <option value="percent">Percent (%)</option>
                <option value="fixed">Fixed (₹)</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Value *</label>
              <input
                type="number"
                value={form.value}
                onChange={e => set("value", e.target.value)}
                className={inputCls}
                placeholder="20"
                required min="0" step="0.01"
              />
            </div>
            <div>
              <label className={labelCls}>Min Order (₹)</label>
              <input
                type="number"
                value={form.minOrder}
                onChange={e => set("minOrder", e.target.value)}
                className={inputCls}
                min="0"
              />
            </div>
            <div>
              <label className={labelCls}>Max Uses (0=∞)</label>
              <input
                type="number"
                value={form.maxUses}
                onChange={e => set("maxUses", e.target.value)}
                className={inputCls}
                min="0"
              />
            </div>
            <div>
              <label className={labelCls}>Expires At</label>
              <input
                type="date"
                value={form.expiresAt}
                onChange={e => set("expiresAt", e.target.value)}
                className={inputCls}
              />
            </div>
            <div className="col-span-2 md:col-span-3 lg:col-span-6 flex gap-3 pt-1">
              <button
                type="submit"
                disabled={saving}
                className="btn-primary text-sm px-6"
              >
                {saving
                  ? <><Loader2 size={13} className="animate-spin" /> Saving…</>
                  : "Create Coupon"}
              </button>
              <button
                type="button"
                onClick={() => setAdding(false)}
                className="px-4 text-sm text-white/40 hover:text-white/70 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="rounded-2xl border border-white/[0.07] overflow-hidden" style={PANEL}>
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 size={26} className="animate-spin text-fig-terracotta/60" />
          </div>
        ) : coupons.length === 0 ? (
          <div className="text-center py-16">
            <Tag size={32} className="text-white/[0.07] mx-auto mb-3" />
            <p className="font-fig-body text-sm text-white/25">No coupons yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr
                  className="border-b border-white/[0.05]"
                  style={{ background: "rgba(255,255,255,0.025)" }}
                >
                  {["Code","Type","Value","Min Order","Uses","Expires","Active",""].map((h, i) => (
                    <th
                      key={i}
                      className="px-5 py-3 text-left font-mono text-[9px] text-white/25 uppercase tracking-widest whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {coupons.map(c => (
                  <tr
                    key={c._id}
                    className="border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors last:border-b-0"
                  >
                    <td className="px-5 py-3.5 font-mono font-bold text-fig-terracotta">
                      {c.code}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-block font-mono text-[10px] px-2 py-0.5 rounded-full bg-white/[0.07] text-white/45 capitalize">
                        {c.type}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-fig font-bold font-semibold text-white/85">
                      {c.type === "percent" ? `${c.value}%` : `₹${c.value}`}
                    </td>
                    <td className="px-5 py-3.5 font-fig-body text-white/45">
                      {c.minOrder ? `₹${c.minOrder}` : "—"}
                    </td>
                    <td className="px-5 py-3.5 font-mono text-xs text-white/45">
                      {c.usedCount}/{c.maxUses || "∞"}
                    </td>
                    <td className="px-5 py-3.5 font-mono text-xs text-white/35">
                      {c.expiresAt ? new Date(c.expiresAt).toLocaleDateString("en-IN") : "Never"}
                    </td>
                    <td className="px-5 py-3.5">
                      <button onClick={() => toggle(c._id, !c.active)} className="flex">
                        {c.active
                          ? <ToggleRight size={22} className="text-green-400" />
                          : <ToggleLeft  size={22} className="text-white/20"  />}
                      </button>
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => del(c._id, c.code)}
                        className="p-2 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/[0.08] transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
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
