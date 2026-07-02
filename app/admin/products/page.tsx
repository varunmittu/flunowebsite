"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Trash2, Loader2, Package, ToggleLeft, ToggleRight } from "lucide-react";

interface Product {
  _id: string; name: string; slug: string; price: number;
  category: string; inStock: boolean; featured: boolean;
  images: string[]; active: boolean;
}

const PANEL = { background: "rgba(255,255,255,0.04)" };

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading,  setLoading]  = useState(true);

  const load = () =>
    fetch("/api/admin/products").then(r => r.json()).then(d => {
      setProducts(d.products ?? []); setLoading(false);
    });

  useEffect(() => { load(); }, []);

  async function toggle(id: string, field: "inStock" | "active" | "featured", val: boolean) {
    await fetch(`/api/admin/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: val }),
    });
    load();
  }

  async function del(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div className="flex-1 p-6 lg:p-8 min-h-screen">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="font-mono text-[9px] text-fluno-purple/45 tracking-[0.22em] uppercase mb-1">Management</p>
          <h1 className="font-brand font-bold text-2xl text-white">Products</h1>
          <p className="font-body text-sm text-white/35 mt-0.5">{products.length} total</p>
        </div>
        <Link href="/admin/products/new" className="btn-primary text-sm gap-2">
          <Plus size={15} /> Add Product
        </Link>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-white/[0.07] overflow-hidden" style={PANEL}>
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 size={26} className="animate-spin text-fluno-purple/60" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <Package size={32} className="text-white/[0.07] mx-auto mb-3" />
            <p className="font-body text-sm text-white/25">No products yet.</p>
            <Link href="/admin/products/new" className="btn-primary text-sm mt-4 inline-flex">
              Add your first product
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
                  {["Product","Price","Category","Stock","Featured","Visible","Actions"].map(h => (
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
                {products.map(p => (
                  <tr
                    key={p._id}
                    className="border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors last:border-b-0"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        {p.images?.[0] ? (
                          <div className="w-9 h-9 rounded-lg overflow-hidden bg-white/[0.06] flex-shrink-0">
                            <Image
                              src={p.images[0]}
                              alt={p.name}
                              width={36} height={36}
                              className="object-cover w-full h-full"
                            />
                          </div>
                        ) : (
                          <div className="w-9 h-9 rounded-lg bg-white/[0.06] flex-shrink-0 flex items-center justify-center">
                            <Package size={14} className="text-white/25" />
                          </div>
                        )}
                        <div>
                          <p className="font-body font-medium text-white/85">{p.name}</p>
                          <p className="font-mono text-[10px] text-white/30">{p.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-brand font-semibold text-fluno-purple">
                      ₹{p.price}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-block font-mono text-[10px] px-2 py-0.5 rounded-full bg-white/[0.07] text-white/45">
                        {p.category || "—"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => toggle(p._id, "inStock", !p.inStock)}
                        title="Toggle stock"
                        className="flex"
                      >
                        {p.inStock
                          ? <ToggleRight size={22} className="text-green-400" />
                          : <ToggleLeft  size={22} className="text-white/20"  />}
                      </button>
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => toggle(p._id, "featured", !p.featured)}
                        title="Toggle featured"
                        className="flex"
                      >
                        {p.featured
                          ? <ToggleRight size={22} className="text-fluno-purple" />
                          : <ToggleLeft  size={22} className="text-white/20"     />}
                      </button>
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => toggle(p._id, "active", !p.active)}
                        title="Toggle visible"
                        className="flex"
                      >
                        {p.active
                          ? <ToggleRight size={22} className="text-blue-400" />
                          : <ToggleLeft  size={22} className="text-white/20" />}
                      </button>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1">
                        <Link
                          href={`/admin/products/${p._id}/edit`}
                          className="p-2 rounded-lg text-white/30 hover:text-fluno-purple hover:bg-fluno-purple/10 transition-all"
                        >
                          <Pencil size={14} />
                        </Link>
                        <button
                          onClick={() => del(p._id, p.name)}
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
