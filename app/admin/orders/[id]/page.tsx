"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Check } from "lucide-react";

interface OrderDetail {
  _id: string; orderId: string; total: number; subtotal: number;
  shipping: number; discount: number; coupon: string | null;
  status: string; createdAt: string; paymentId: string | null;
  razorpayOrderId: string | null;
  courier: string | null; trackingId: string | null; trackingUrl: string | null;
  address: {
    name: string; email: string; phone: string; address: string;
    city: string; state: string; pincode: string;
  };
  items: { name: string; size: string; price: number; quantity: number; image: string }[];
}

const STATUSES = ["pending","paid","processing","shipped","delivered","cancelled","refunded"];

const statusColors: Record<string, string> = {
  pending:    "bg-yellow-500/15 text-yellow-400 border-yellow-500/25",
  paid:       "bg-blue-500/15 text-blue-400 border-blue-500/25",
  processing: "bg-purple-500/15 text-purple-400 border-purple-500/25",
  shipped:    "bg-indigo-500/15 text-indigo-400 border-indigo-500/25",
  delivered:  "bg-green-500/15 text-green-400 border-green-500/25",
  cancelled:  "bg-red-500/15 text-red-400 border-red-500/25",
  refunded:   "bg-gray-500/15 text-gray-400 border-gray-500/25",
};

const PANEL = { background: "rgba(255,255,255,0.04)" };

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const [order,   setOrder]   = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [tracking, setTracking] = useState({ courier: "", trackingId: "", trackingUrl: "" });
  const [trackSaving, setTrackSaving] = useState(false);
  const [trackSaved,  setTrackSaved]  = useState(false);

  useEffect(() => {
    fetch(`/api/admin/orders/${id}`).then(r => r.json()).then(d => {
      setOrder(d.order); setLoading(false);
      if (d.order) {
        setTracking({
          courier:     d.order.courier     ?? "",
          trackingId:  d.order.trackingId  ?? "",
          trackingUrl: d.order.trackingUrl ?? "",
        });
      }
    });
  }, [id]);

  async function updateStatus(status: string) {
    setSaving(true);
    const res = await fetch(`/api/admin/orders/${id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, ...tracking }),
    });
    const d = await res.json();
    setOrder(d.order); setSaving(false);
  }

  async function saveTracking() {
    setTrackSaving(true);
    const res = await fetch(`/api/admin/orders/${id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tracking),
    });
    const d = await res.json();
    setOrder(d.order);
    setTrackSaving(false);
    setTrackSaved(true);
    setTimeout(() => setTrackSaved(false), 2000);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-56px)]">
        <Loader2 size={26} className="animate-spin text-fig-terracotta/60" />
      </div>
    );
  }
  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-56px)]">
        <p className="text-white/30">Order not found.</p>
      </div>
    );
  }

  const sc = statusColors[order.status] ?? "bg-gray-500/15 text-gray-400 border-gray-500/25";

  return (
    <div className="flex-1 p-6 lg:p-8 min-h-screen">

      {/* Back + title */}
      <div className="flex items-center gap-4 mb-7">
        <Link
          href="/admin/orders"
          className="p-2 rounded-xl text-white/30 hover:text-white/70 hover:bg-white/[0.06] transition-all"
        >
          <ArrowLeft size={18} />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="font-fig font-bold text-xl text-white truncate">{order.orderId}</h1>
          <p className="font-mono text-xs text-white/30 mt-0.5">
            {new Date(order.createdAt).toLocaleString("en-IN")}
          </p>
        </div>
        <span className={`inline-block text-[11px] font-mono px-3 py-1.5 rounded-full capitalize border ${sc}`}>
          {order.status}
        </span>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">

        {/* Left — items + payment */}
        <div className="lg:col-span-2 space-y-5">

          {/* Items card */}
          <div className="rounded-2xl border border-white/[0.07] overflow-hidden" style={PANEL}>
            <div className="px-5 py-4 border-b border-white/[0.05]">
              <h2 className="font-fig font-bold text-sm font-semibold text-white">Items</h2>
            </div>
            <div>
              {order.items.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 px-5 py-4 border-b border-white/[0.04] last:border-b-0"
                >
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded-xl object-cover border border-white/[0.08] flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-fig-body font-medium text-white/80 truncate">{item.name}</p>
                    <p className="font-mono text-xs text-white/35">{item.size}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-mono text-xs text-white/35">×{item.quantity}</p>
                    <p className="font-fig font-bold font-semibold text-white/85">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div
              className="px-5 py-4 border-t border-white/[0.05] space-y-1.5"
              style={{ background: "rgba(255,255,255,0.02)" }}
            >
              {[
                ["Subtotal", `₹${order.subtotal?.toLocaleString("en-IN")}`],
                ["Shipping", `₹${order.shipping?.toLocaleString("en-IN")}`],
                ...(order.discount
                  ? [["Discount", `-₹${order.discount?.toLocaleString("en-IN")}${order.coupon ? ` (${order.coupon})` : ""}`]]
                  : []),
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between text-sm">
                  <span className="text-white/35 font-fig-body">{k}</span>
                  <span className="text-white/60 font-fig-body">{v}</span>
                </div>
              ))}
              <div className="flex justify-between pt-2.5 mt-1 border-t border-white/[0.06]">
                <span className="font-fig font-bold font-semibold text-white/80">Total</span>
                <span className="font-fig font-bold text-lg text-fig-terracotta">
                  ₹{order.total?.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>

          {/* Payment card */}
          <div className="rounded-2xl border border-white/[0.07] p-5" style={PANEL}>
            <h2 className="font-fig font-bold text-sm font-semibold text-white border-b border-white/[0.06] pb-3 mb-3">
              Payment
            </h2>
            <div className="space-y-2.5">
              {[
                ["Razorpay Order ID", order.razorpayOrderId || "—"],
                ["Payment ID",        order.paymentId       || "—"],
              ].map(([k, v]) => (
                <div key={k} className="flex gap-4 text-sm">
                  <span className="text-white/30 font-mono text-xs w-40 flex-shrink-0">{k}</span>
                  <span className="font-mono text-xs text-white/55 break-all">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right — customer + status */}
        <div className="space-y-5">

          {/* Customer card */}
          <div className="rounded-2xl border border-white/[0.07] p-5" style={PANEL}>
            <h2 className="font-fig font-bold text-sm font-semibold text-white border-b border-white/[0.06] pb-3 mb-3">
              Customer
            </h2>
            <div className="space-y-2.5">
              {[
                ["Name",    order.address?.name    ],
                ["Email",   order.address?.email   ],
                ["Phone",   order.address?.phone   ],
                ["Address", order.address?.address ],
                ["City",    order.address?.city    ],
                ["State",   order.address?.state   ],
                ["Pincode", order.address?.pincode ],
              ].map(([k, v]) => (
                <div key={k} className="flex gap-3">
                  <span className="text-white/30 font-mono text-[10px] w-16 flex-shrink-0 pt-0.5">{k}</span>
                  <span className="font-fig-body text-xs text-white/60 break-all">{v || "—"}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tracking card */}
          <div className="rounded-2xl border border-white/[0.07] p-5" style={PANEL}>
            <h2 className="font-fig font-bold text-sm font-semibold text-white border-b border-white/[0.06] pb-3 mb-4">
              Shipment Tracking
            </h2>
            <div className="space-y-3">
              {([
                ["courier",     "Courier (e.g. Delhivery)"],
                ["trackingId",  "Tracking ID / AWB"],
                ["trackingUrl", "Tracking URL"],
              ] as const).map(([key, placeholder]) => (
                <input
                  key={key}
                  value={tracking[key]}
                  onChange={(e) => setTracking((t) => ({ ...t, [key]: e.target.value }))}
                  placeholder={placeholder}
                  className="w-full bg-white/[0.06] border border-white/[0.1] text-white text-sm rounded-xl px-3.5 py-2.5 placeholder:text-white/20 focus:outline-none focus:border-fig-terracotta/50 transition-colors font-fig-body"
                />
              ))}
              <button
                onClick={saveTracking}
                disabled={trackSaving}
                className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-fig-body bg-fig-terracotta/20 text-fig-terracotta border border-fig-terracotta/30 hover:bg-fig-terracotta/30 transition-colors disabled:opacity-50"
              >
                {trackSaving ? <Loader2 size={14} className="animate-spin" /> : trackSaved ? <><Check size={14} /> Saved</> : "Save Tracking"}
              </button>
              <p className="font-mono text-[10px] text-white/25 leading-relaxed">
                Fill tracking first, then set status to &ldquo;shipped&rdquo; — the customer gets an email with the tracking link.
              </p>
            </div>
          </div>

          {/* Update status card */}
          <div className="rounded-2xl border border-white/[0.07] p-5" style={PANEL}>
            <h2 className="font-fig font-bold text-sm font-semibold text-white border-b border-white/[0.06] pb-3 mb-4">
              Update Status
            </h2>
            <div className="space-y-1.5">
              {STATUSES.map(s => {
                const isActive = s === order.status;
                return (
                  <button
                    key={s}
                    disabled={isActive || saving}
                    onClick={() => updateStatus(s)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-fig-body capitalize transition-all ${
                      isActive
                        ? "bg-fig-terracotta/20 text-white border border-fig-terracotta/30 cursor-default"
                        : "text-white/40 border border-white/[0.06] hover:border-white/[0.15] hover:text-white/70 hover:bg-white/[0.05]"
                    }`}
                  >
                    {s}
                    {isActive && <Check size={13} className="text-fig-terracotta" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
