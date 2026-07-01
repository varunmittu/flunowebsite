"use client";

import { useEffect, useState } from "react";
import { IndianRupee, ShoppingBag, Package, Tag, FileText, TrendingUp, Loader2, Zap } from "lucide-react";
import Link from "next/link";

interface Stats {
  revenue: number;
  paidOrders: number;
  totalOrders: number;
  totalProducts: number;
  publishedBlogs: number;
  activeCoupons: number;
  recentOrders: Array<{
    _id: string; orderId: string; total: number;
    status: string; createdAt: string;
    address: { name: string };
  }>;
}

const statusColors: Record<string, string> = {
  pending:    "bg-yellow-500/15 text-yellow-400",
  paid:       "bg-blue-500/15 text-blue-400",
  processing: "bg-purple-500/15 text-purple-400",
  shipped:    "bg-indigo-500/15 text-indigo-400",
  delivered:  "bg-green-500/15 text-green-400",
  cancelled:  "bg-red-500/15 text-red-400",
  refunded:   "bg-gray-500/15 text-gray-400",
};

export default function Dashboard() {
  const [stats, setStats]   = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((d) => { setStats(d); setLoading(false); });
  }, []);

  async function seedData() {
    setSeeding(true);
    const r = await fetch("/api/admin/seed", { method: "POST" });
    const d = await r.json();
    alert(`Seeded: ${d.productsSeeded} products, ${d.categoriesSeeded} categories`);
    setSeeding(false);
    window.location.reload();
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen bg-fluno-light">
        <Loader2 size={32} className="animate-spin text-fluno-purple" />
      </div>
    );
  }

  const cards = [
    { label: "Total Revenue",    value: `₹${(stats?.revenue ?? 0).toLocaleString("en-IN")}`, icon: IndianRupee, color: "from-fluno-purple/20 to-fluno-purple-deep/10", iconBg: "bg-fluno-purple/20", iconColor: "text-fluno-purple" },
    { label: "Paid Orders",      value: stats?.paidOrders ?? 0,    icon: ShoppingBag, color: "from-blue-500/15 to-blue-600/5",   iconBg: "bg-blue-500/20",   iconColor: "text-blue-400"   },
    { label: "Active Products",  value: stats?.totalProducts ?? 0, icon: Package,     color: "from-green-500/15 to-green-600/5", iconBg: "bg-green-500/20",  iconColor: "text-green-400"  },
    { label: "Active Coupons",   value: stats?.activeCoupons ?? 0, icon: Tag,         color: "from-orange-500/15 to-orange-600/5", iconBg: "bg-orange-500/20", iconColor: "text-orange-400" },
    { label: "Published Blogs",  value: stats?.publishedBlogs ?? 0, icon: FileText,   color: "from-pink-500/15 to-pink-600/5",  iconBg: "bg-pink-500/20",   iconColor: "text-pink-400"   },
    { label: "Total Orders",     value: stats?.totalOrders ?? 0,   icon: TrendingUp,  color: "from-teal-500/15 to-teal-600/5",  iconBg: "bg-teal-500/20",   iconColor: "text-teal-400"   },
  ];

  return (
    <div className="flex-1 p-6 lg:p-10 bg-fluno-light min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl text-fluno-ink">Dashboard</h1>
          <p className="font-body text-sm text-fluno-muted mt-0.5">Welcome back, Admin</p>
        </div>
        <button
          onClick={seedData}
          disabled={seeding}
          className="btn-outline text-sm gap-2"
          title="Seed static products and categories to MongoDB"
        >
          {seeding ? <Loader2 size={15} className="animate-spin" /> : <Zap size={15} />}
          Seed Initial Data
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {cards.map(({ label, value, icon: Icon, color, iconBg, iconColor }) => (
          <div key={label} className={`bg-gradient-to-br ${color} border border-fluno-lavender rounded-2xl p-5 bg-white`}>
            <div className={`w-10 h-10 ${iconBg} rounded-xl flex items-center justify-center mb-3`}>
              <Icon size={20} className={iconColor} />
            </div>
            <p className="font-brand font-bold text-2xl text-fluno-ink">{value}</p>
            <p className="font-body text-xs text-fluno-muted mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-2xl border border-fluno-lavender overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-fluno-lavender">
          <h2 className="font-display text-base text-fluno-ink">Recent Orders</h2>
          <Link href="/admin/orders" className="text-xs text-fluno-purple hover:underline font-body">
            View all →
          </Link>
        </div>

        {!stats?.recentOrders?.length ? (
          <p className="text-center py-12 font-body text-sm text-fluno-muted">No orders yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-fluno-lavender/60 bg-fluno-light/50">
                  {["Order ID", "Customer", "Total", "Status", "Date"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left font-mono text-xs text-fluno-muted/70 uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((o) => (
                  <tr key={o._id} className="border-b border-fluno-lavender/40 hover:bg-fluno-light/60 transition-colors">
                    <td className="px-5 py-3.5">
                      <Link href={`/admin/orders/${o._id}`} className="font-mono text-xs text-fluno-purple hover:underline">
                        {o.orderId}
                      </Link>
                    </td>
                    <td className="px-5 py-3.5 font-body text-fluno-ink/80">{o.address?.name ?? "—"}</td>
                    <td className="px-5 py-3.5 font-brand font-semibold text-fluno-ink">₹{o.total?.toLocaleString("en-IN")}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-block text-xs font-mono px-2.5 py-1 rounded-full ${statusColors[o.status] ?? "bg-gray-100 text-gray-500"}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-xs text-fluno-muted">
                      {new Date(o.createdAt).toLocaleDateString("en-IN")}
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
