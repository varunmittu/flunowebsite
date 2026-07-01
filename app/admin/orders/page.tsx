"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, ShoppingBag } from "lucide-react";

interface Order {
  _id: string; orderId: string; total: number; status: string;
  createdAt: string; address: { name: string; email: string; city: string };
  items: { name: string; quantity: number }[];
}

const statuses = ["all","pending","paid","processing","shipped","delivered","cancelled","refunded"];

const statusColors: Record<string, string> = {
  pending:    "bg-yellow-100 text-yellow-700",
  paid:       "bg-blue-100 text-blue-700",
  processing: "bg-purple-100 text-purple-700",
  shipped:    "bg-indigo-100 text-indigo-700",
  delivered:  "bg-green-100 text-green-700",
  cancelled:  "bg-red-100 text-red-700",
  refunded:   "bg-gray-100 text-gray-600",
};

export default function AdminOrders() {
  const [orders, setOrders]     = useState<Order[]>([]);
  const [total, setTotal]       = useState(0);
  const [loading, setLoading]   = useState(true);
  const [status, setStatus]     = useState("all");

  const load = (s: string) => {
    setLoading(true);
    fetch(`/api/admin/orders?status=${s}`).then(r => r.json()).then(d => {
      setOrders(d.orders ?? []); setTotal(d.total ?? 0); setLoading(false);
    });
  };

  useEffect(() => { load(status); }, [status]);

  return (
    <div className="flex-1 p-6 lg:p-10 bg-fluno-light min-h-screen">
      <div className="mb-8">
        <h1 className="font-display text-2xl text-fluno-ink">Orders</h1>
        <p className="font-body text-sm text-fluno-muted mt-0.5">{total} orders</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap mb-6">
        {statuses.map(s => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`px-4 py-2 rounded-full text-xs font-semibold font-body capitalize transition-all ${
              status === s ? "bg-fluno-purple text-white shadow-lg shadow-fluno-purple/20" : "bg-white text-fluno-muted border border-fluno-lavender hover:border-fluno-purple hover:text-fluno-purple"
            }`}
          >
            {s === "all" ? "All" : s}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-fluno-lavender overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><Loader2 size={28} className="animate-spin text-fluno-purple" /></div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag size={36} className="text-fluno-lavender mx-auto mb-3" />
            <p className="font-body text-sm text-fluno-muted">No orders found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-fluno-lavender/60 bg-fluno-light/50">
                  {["Order ID","Customer","Items","Total","Status","Date",""].map(h => (
                    <th key={h} className="px-5 py-3 text-left font-mono text-xs text-fluno-muted/70 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o._id} className="border-b border-fluno-lavender/40 hover:bg-fluno-light/60 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs text-fluno-purple font-semibold">{o.orderId}</td>
                    <td className="px-5 py-3.5">
                      <p className="font-body font-medium text-fluno-ink">{o.address?.name}</p>
                      <p className="font-mono text-[10px] text-fluno-muted">{o.address?.city}</p>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-xs text-fluno-muted">{o.items?.length ?? 0} item{o.items?.length !== 1 ? "s" : ""}</td>
                    <td className="px-5 py-3.5 font-brand font-bold text-fluno-ink">₹{o.total?.toLocaleString("en-IN")}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-block text-xs font-mono px-2.5 py-1 rounded-full capitalize ${statusColors[o.status] ?? "bg-gray-100 text-gray-500"}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-xs text-fluno-muted whitespace-nowrap">
                      {new Date(o.createdAt).toLocaleDateString("en-IN")}
                    </td>
                    <td className="px-5 py-3.5">
                      <Link href={`/admin/orders/${o._id}`} className="text-xs text-fluno-purple hover:underline font-semibold">View →</Link>
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
