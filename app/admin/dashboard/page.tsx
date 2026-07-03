"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  IndianRupee, ShoppingBag, Package, Tag,
  FileText, TrendingUp, Loader2, Zap, ArrowRight, ArrowUpRight,
  Bell, Send, Users,
} from "lucide-react";
import Link from "next/link";
import { HappyTeam, DoodleSparkle, DoodleReveal } from "@/components/doodles/Doodles";

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
  pending:    "bg-yellow-500/15 text-yellow-400 border border-yellow-500/25",
  paid:       "bg-blue-500/15 text-blue-400 border border-blue-500/25",
  processing: "bg-purple-500/15 text-purple-400 border border-purple-500/25",
  shipped:    "bg-indigo-500/15 text-indigo-400 border border-indigo-500/25",
  delivered:  "bg-green-500/15 text-green-400 border border-green-500/25",
  cancelled:  "bg-red-500/15 text-red-400 border border-red-500/25",
  refunded:   "bg-gray-500/15 text-gray-400 border border-gray-500/25",
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};
const cardVariant = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.48, ease: [0.22, 1, 0.36, 1] } },
};
const fadeUp = {
  hidden:  { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.52, ease: [0.22, 1, 0.36, 1] } },
};

interface StatCard {
  label: string;
  value: string | number;
  icon: React.ElementType;
  topGradient: string;
  iconBg: string;
  iconColor: string;
}

const PANEL = { background: "rgba(255,255,255,0.04)" };

const inputCls = "w-full bg-white/[0.06] border border-white/[0.1] text-white text-sm rounded-xl px-3.5 py-2.5 placeholder:text-white/20 focus:outline-none focus:border-fig-terracotta/50 transition-colors font-fig-body";
const labelCls = "block font-mono text-[10px] text-white/35 uppercase tracking-wider mb-1.5";

export default function Dashboard() {
  const [stats,         setStats]         = useState<Stats | null>(null);
  const [loading,       setLoading]       = useState(true);
  const [seeding,       setSeeding]       = useState(false);
  const [subCount,      setSubCount]      = useState<number | null>(null);
  const [notifTitle,    setNotifTitle]    = useState("");
  const [notifBody,     setNotifBody]     = useState("");
  const [notifUrl,      setNotifUrl]      = useState("/");
  const [sending,       setSending]       = useState(false);
  const [notifResult,   setNotifResult]   = useState<{ sent: number; failed: number } | null>(null);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((d) => { setStats(d); setLoading(false); });
    fetch("/api/push/send")
      .then((r) => r.json())
      .then((d) => { if (d.count !== undefined) setSubCount(d.count); })
      .catch(() => {});
  }, []);

  async function sendNotification(e: React.FormEvent) {
    e.preventDefault();
    if (!notifTitle.trim() || !notifBody.trim()) return;
    setSending(true);
    setNotifResult(null);
    try {
      const res  = await fetch("/api/push/send", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ title: notifTitle, body: notifBody, url: notifUrl }),
      });
      const data = await res.json();
      setNotifResult(data);
      if (data.sent > 0) { setNotifTitle(""); setNotifBody(""); setNotifUrl("/"); }
    } finally {
      setSending(false);
    }
  }

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
      <div className="flex items-center justify-center min-h-[calc(100vh-56px)]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={26} className="animate-spin text-fig-terracotta/60" />
          <p className="font-mono text-xs text-white/25">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  const cards: StatCard[] = [
    {
      label: "Total Revenue",
      value: `₹${(stats?.revenue ?? 0).toLocaleString("en-IN")}`,
      icon: IndianRupee,
      topGradient: "from-fig-terracotta to-purple-700",
      iconBg: "bg-fig-terracotta/15",
      iconColor: "text-fig-terracotta",
    },
    {
      label: "Paid Orders",
      value: stats?.paidOrders ?? 0,
      icon: ShoppingBag,
      topGradient: "from-blue-400 to-blue-700",
      iconBg: "bg-blue-500/15",
      iconColor: "text-blue-400",
    },
    {
      label: "Active Products",
      value: stats?.totalProducts ?? 0,
      icon: Package,
      topGradient: "from-emerald-400 to-emerald-600",
      iconBg: "bg-emerald-500/15",
      iconColor: "text-emerald-400",
    },
    {
      label: "Active Coupons",
      value: stats?.activeCoupons ?? 0,
      icon: Tag,
      topGradient: "from-orange-400 to-orange-600",
      iconBg: "bg-orange-500/15",
      iconColor: "text-orange-400",
    },
    {
      label: "Published Blogs",
      value: stats?.publishedBlogs ?? 0,
      icon: FileText,
      topGradient: "from-pink-400 to-pink-600",
      iconBg: "bg-pink-500/15",
      iconColor: "text-pink-400",
    },
    {
      label: "Total Orders",
      value: stats?.totalOrders ?? 0,
      icon: TrendingUp,
      topGradient: "from-teal-400 to-teal-600",
      iconBg: "bg-teal-500/15",
      iconColor: "text-teal-400",
    },
  ];

  return (
    <div className="flex-1 p-6 lg:p-8">

      {/* Welcome banner */}
      <div className="relative overflow-hidden mb-8 rounded-3xl border-[2.5px] border-fig-navy bg-fig-sage shadow-[5px_5px_0_0_#1E1E24] px-6 py-5 flex items-center justify-between gap-4">
        <div className="relative z-10">
          <p className="fig-eyebrow text-fig-navy/70 mb-1">Fluno admin</p>
          <h2 className="font-fig font-bold text-2xl md:text-3xl text-fig-navy">Welcome back!</h2>
          <p className="font-fig-body text-sm text-fig-navy/75 mt-1">Here&apos;s how your store is doing today.</p>
        </div>
        <DoodleReveal className="hidden sm:block shrink-0">
          <HappyTeam className="w-44 lg:w-56 h-auto" />
        </DoodleReveal>
        <DoodleSparkle className="absolute top-4 right-4 w-6 h-6 animate-wiggle" tone="coral" />
      </div>

      {/* Header */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="flex items-start justify-between mb-8"
      >
        <div>
          <p className="font-mono text-[9px] text-fig-terracotta/45 tracking-[0.22em] uppercase mb-1">
            Overview
          </p>
          <h1 className="font-fig font-bold text-2xl text-white">Dashboard</h1>
          <p className="font-fig-body text-sm text-white/35 mt-0.5">
            {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
          </p>
        </div>

        <button
          onClick={seedData}
          disabled={seeding}
          className="flex items-center gap-2 font-mono text-[11px] text-white/35 hover:text-white/60 border border-white/[0.1] hover:border-white/20 px-3.5 py-2 rounded-xl transition-all disabled:opacity-50"
        >
          {seeding ? <Loader2 size={12} className="animate-spin" /> : <Zap size={12} />}
          Seed Data
        </button>
      </motion.div>

      {/* Stat cards */}
      <motion.div
        className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {cards.map(({ label, value, icon: Icon, topGradient, iconBg, iconColor }) => (
          <motion.div
            key={label}
            variants={cardVariant}
            className="relative rounded-2xl border border-white/[0.07] overflow-hidden group hover:-translate-y-0.5 transition-transform duration-200 cursor-default"
            style={PANEL}
          >
            <div className={`h-[2px] bg-gradient-to-r ${topGradient}`} />
            <div className="p-5 lg:p-6">
              <div className={`w-10 h-10 ${iconBg} rounded-xl flex items-center justify-center mb-4`}>
                <Icon size={18} className={iconColor} />
              </div>
              <p className="font-fig font-bold text-2xl lg:text-3xl text-white leading-none">
                {value}
              </p>
              <p className="font-fig-body text-xs text-white/38 mt-2">{label}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Push Notifications */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.35 }}
        className="rounded-2xl border border-white/[0.07] overflow-hidden mb-6"
        style={PANEL}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-fig-terracotta/15 flex items-center justify-center">
              <Bell size={15} className="text-fig-terracotta" />
            </div>
            <div>
              <h2 className="font-fig font-bold text-sm font-semibold text-white">Push Notifications</h2>
              <p className="font-mono text-[10px] text-white/30 mt-0.5">Broadcast to all subscribers</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-white/[0.05] px-3 py-1.5 rounded-xl">
            <Users size={11} className="text-fig-terracotta/60" />
            <span className="font-mono text-xs text-white/50">
              {subCount === null ? "…" : subCount} subscriber{subCount !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        <form onSubmit={sendNotification} className="p-6 space-y-4">
          {notifResult && (
            <div
              className={`rounded-xl px-4 py-3 text-sm font-fig-body border ${
                notifResult.sent > 0
                  ? "border-green-500/20 text-green-400"
                  : "border-yellow-500/20 text-yellow-400"
              }`}
              style={{ background: notifResult.sent > 0 ? "rgba(34,197,94,0.08)" : "rgba(234,179,8,0.08)" }}
            >
              {notifResult.sent > 0
                ? `✓ Sent to ${notifResult.sent} subscriber${notifResult.sent !== 1 ? "s" : ""}${notifResult.failed > 0 ? ` (${notifResult.failed} failed)` : ""}`
                : "No active subscribers yet. Share your site to get subscribers!"}
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Title *</label>
              <input
                value={notifTitle}
                onChange={(e) => setNotifTitle(e.target.value)}
                className={inputCls}
                placeholder="New Product Drop! 🛍️"
                required
              />
            </div>
            <div>
              <label className={labelCls}>Link URL</label>
              <input
                value={notifUrl}
                onChange={(e) => setNotifUrl(e.target.value)}
                className={inputCls}
                placeholder="/shop"
              />
            </div>
          </div>

          <div>
            <label className={labelCls}>Message *</label>
            <textarea
              value={notifBody}
              onChange={(e) => setNotifBody(e.target.value)}
              className={inputCls + " min-h-[70px] resize-none"}
              placeholder="Check out our latest Fluno sunscreen — now with SPF 50+…"
              required
            />
          </div>

          <button
            type="submit"
            disabled={sending || !notifTitle.trim() || !notifBody.trim()}
            className="flex items-center gap-2 bg-fig-terracotta text-white font-fig-body text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-fig-terracotta/85 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
            {sending ? "Sending…" : "Send Notification"}
          </button>
        </form>
      </motion.div>

      {/* Recent orders */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.42 }}
        className="rounded-2xl border border-white/[0.07] overflow-hidden"
        style={PANEL}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
          <div>
            <h2 className="font-fig font-bold text-sm font-semibold text-white">Recent Orders</h2>
            <p className="font-mono text-[10px] text-white/30 mt-0.5">Last 10 transactions</p>
          </div>
          <Link
            href="/admin/orders"
            className="flex items-center gap-1 font-mono text-xs text-fig-terracotta/65 hover:text-fig-terracotta transition-colors"
          >
            View all <ArrowRight size={11} />
          </Link>
        </div>

        {!stats?.recentOrders?.length ? (
          <div className="text-center py-16">
            <ShoppingBag size={30} className="text-white/[0.08] mx-auto mb-3" />
            <p className="font-fig-body text-sm text-white/25">No orders yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr
                  className="border-b border-white/[0.05]"
                  style={{ background: "rgba(255,255,255,0.025)" }}
                >
                  {["Order ID", "Customer", "Total", "Status", "Date"].map((h) => (
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
                {stats.recentOrders.map((o, i) => (
                  <motion.tr
                    key={o._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.48 + i * 0.035, duration: 0.3 }}
                    className="border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors last:border-b-0 group"
                  >
                    <td className="px-5 py-3.5">
                      <Link
                        href={`/admin/orders/${o._id}`}
                        className="font-mono text-xs text-fig-terracotta hover:text-fig-terracotta/70 flex items-center gap-1"
                      >
                        {o.orderId}
                        <ArrowUpRight size={9} className="opacity-0 group-hover:opacity-60 transition-opacity" />
                      </Link>
                    </td>
                    <td className="px-5 py-3.5 font-fig-body text-sm text-white/65">
                      {o.address?.name ?? "—"}
                    </td>
                    <td className="px-5 py-3.5 font-fig font-bold font-semibold text-white/85">
                      ₹{o.total?.toLocaleString("en-IN")}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-block text-[10px] font-mono px-2.5 py-0.5 rounded-full capitalize ${
                          statusColors[o.status] ?? "bg-gray-500/15 text-gray-400 border border-gray-500/25"
                        }`}
                      >
                        {o.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-xs text-white/32 whitespace-nowrap">
                      {new Date(o.createdAt).toLocaleDateString("en-IN")}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
}
