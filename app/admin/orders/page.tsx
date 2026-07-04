"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, ArrowRight, ShoppingBag } from "lucide-react";

interface Order {
  _id: string; orderId: string; total: number; status: string;
  createdAt: string; address: { name: string; email: string; city: string };
  items: { name: string; quantity: number }[];
}

const statuses = ["all","pending","paid","processing","shipped","delivered","cancelled","refunded"];

const statusColors: Record<string, string> = {
  pending:    "bg-yellow-500/15 text-yellow-400 border border-yellow-500/25",
  paid:       "bg-blue-500/15 text-blue-400 border border-blue-500/25",
  processing: "bg-purple-500/15 text-purple-400 border border-purple-500/25",
  shipped:    "bg-indigo-500/15 text-indigo-400 border border-indigo-500/25",
  delivered:  "bg-green-500/15 text-green-400 border border-green-500/25",
  cancelled:  "bg-red-500/15 text-red-400 border border-red-500/25",
  refunded:   "bg-gray-500/15 text-gray-400 border border-gray-500/25",
};

const PANEL = { background: "rgba(255,255,255,0.04)" };

export default function AdminOrders() {
  const [orders, setOrders]   = useState<Order[]>([]);
  const [total,  setTotal]    = useState(0);
  const [loading,setLoading]  = useState(true);
  const [status, setStatus]   = useState("all");

  const load = (s: string) => {
    setLoading(true);
    fetch(`/api/admin/orders?status=${s}`).then(r => r.json()).then(d => {
      setOrders(d.orders ?? []); setTotal(d.total ?? 0); setLoading(false);
    });
  };

  useEffect(() => { load(status); }, [status]);

  return (
    <div className="flex-1 p-6 lg:p-8 min-h-screen">

      {/* Header */}
      <div className="mb-6">
        <p className="font-mono text-[9px] text-fig-terracotta/45 tracking-[0.22em] uppercase mb-1">Management</p>
        <h1 className="font-fig font-bold text-2xl text-white">Orders</h1>
        <p className="font-fig-body text-sm text-white/35 mt-0.5">{total} total orders</p>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-2 flex-wrap mb-5">
        {statuses.map(s => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`px-3.5 py-1.5 rounded-lg text-[11px] font-mono capitalize transition-all ${
              status === s
                ? "bg-fig-terracotta/20 text-fig-terracotta border border-fig-terracotta/30"
                : "text-white/35 border border-white/[0.08] hover:border-white/20 hover:text-white/60 hover:bg-white/[0.04]"
            }`}
          >
            {s === "all" ? "All" : s}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-white/[0.07] overflow-hidden" style={PANEL}>
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 size={26} className="animate-spin text-fig-terracotta/60" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag size={32} className="text-white/[0.12] mx-auto mb-3" />
            <p className="font-fig font-bold text-white/70">No orders yet</p>
            <p className="font-fig-body text-sm text-white/30 mt-1">They&apos;ll show up here the moment they roll in.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr
                  className="border-b border-white/[0.05]"
                  style={{ background: "rgba(255,255,255,0.025)" }}
                >
                  {["Order ID","Customer","Items","Total","Status","Date",""].map((h, i) => (
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
                {orders.map(o => (
                  <tr
                    key={o._id}
                    className="border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors last:border-b-0 group"
                  >
                    <td className="px-5 py-3.5 font-mono text-xs text-fig-terracotta font-semibold">
                      {o.orderId}
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-fig-body font-medium text-white/80">{o.address?.name}</p>
                      <p className="font-mono text-[10px] text-white/35">{o.address?.city}</p>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-xs text-white/45">
                      {o.items?.length ?? 0} item{o.items?.length !== 1 ? "s" : ""}
                    </td>
                    <td className="px-5 py-3.5 font-fig font-bold font-semibold text-white/85">
                      ₹{o.total?.toLocaleString("en-IN")}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-block text-[10px] font-mono px-2.5 py-0.5 rounded-full capitalize ${
                        statusColors[o.status] ?? "bg-gray-500/15 text-gray-400 border border-gray-500/25"
                      }`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-xs text-white/30 whitespace-nowrap">
                      {new Date(o.createdAt).toLocaleDateString("en-IN")}
                    </td>
                    <td className="px-5 py-3.5">
                      <Link
                        href={`/admin/orders/${o._id}`}
                        className="flex items-center gap-1 text-xs font-mono text-white/30 hover:text-fig-terracotta transition-colors"
                      >
                        View <ArrowRight size={10} />
                      </Link>
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
