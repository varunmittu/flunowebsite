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

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading]   = useState(true);

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
    <div className="flex-1 p-6 lg:p-10 bg-fluno-light min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl text-fluno-ink">Products</h1>
          <p className="font-body text-sm text-fluno-muted mt-0.5">{products.length} total</p>
        </div>
        <Link href="/admin/products/new" className="btn-primary text-sm gap-2">
          <Plus size={16} /> Add Product
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-fluno-lavender overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><Loader2 size={28} className="animate-spin text-fluno-purple" /></div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <Package size={36} className="text-fluno-lavender mx-auto mb-3" />
            <p className="font-body text-sm text-fluno-muted">No products yet.</p>
            <Link href="/admin/products/new" className="btn-primary text-sm mt-4 inline-flex">Add your first product</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-fluno-lavender/60 bg-fluno-light/50">
                  {["Product","Price","Category","Stock","Featured","Visible","Actions"].map(h => (
                    <th key={h} className="px-5 py-3 text-left font-mono text-xs text-fluno-muted/70 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p._id} className="border-b border-fluno-lavender/40 hover:bg-fluno-light/60 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        {p.images?.[0] ? (
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-fluno-lavender/30 flex-shrink-0">
                            <Image src={p.images[0]} alt={p.name} width={40} height={40} className="object-cover w-full h-full" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-fluno-lavender/30 flex-shrink-0 flex items-center justify-center">
                            <Package size={16} className="text-fluno-muted" />
                          </div>
                        )}
                        <div>
                          <p className="font-body font-medium text-fluno-ink">{p.name}</p>
                          <p className="font-mono text-[10px] text-fluno-muted/60">{p.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-brand font-semibold text-fluno-purple">₹{p.price}</td>
                    <td className="px-5 py-3.5">
                      <span className="badge text-[10px]">{p.category || "—"}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <button onClick={() => toggle(p._id, "inStock", !p.inStock)} title="Toggle stock">
                        {p.inStock
                          ? <ToggleRight size={22} className="text-green-500" />
                          : <ToggleLeft  size={22} className="text-gray-400"  />}
                      </button>
                    </td>
                    <td className="px-5 py-3.5">
                      <button onClick={() => toggle(p._id, "featured", !p.featured)} title="Toggle featured">
                        {p.featured
                          ? <ToggleRight size={22} className="text-fluno-purple" />
                          : <ToggleLeft  size={22} className="text-gray-400"     />}
                      </button>
                    </td>
                    <td className="px-5 py-3.5">
                      <button onClick={() => toggle(p._id, "active", !p.active)} title="Toggle visible">
                        {p.active
                          ? <ToggleRight size={22} className="text-blue-500" />
                          : <ToggleLeft  size={22} className="text-gray-400" />}
                      </button>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/products/${p._id}/edit`} className="p-2 rounded-lg text-fluno-muted hover:text-fluno-purple hover:bg-fluno-purple/10 transition-all">
                          <Pencil size={15} />
                        </Link>
                        <button onClick={() => del(p._id, p.name)} className="p-2 rounded-lg text-fluno-muted hover:text-red-500 hover:bg-red-50 transition-all">
                          <Trash2 size={15} />
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
