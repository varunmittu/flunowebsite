"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";

interface OrderDetail {
  _id: string; orderId: string; total: number; subtotal: number;
  shipping: number; discount: number; coupon: string | null;
  status: string; createdAt: string; paymentId: string | null;
  razorpayOrderId: string | null;
  address: { name: string; email: string; phone: string; address: string; city: string; state: string; pincode: string };
  items: { name: string; size: string; price: number; quantity: number; image: string }[];
}

const STATUSES = ["pending","paid","processing","shipped","delivered","cancelled","refunded"];

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700", paid: "bg-blue-100 text-blue-700",
  processing: "bg-purple-100 text-purple-700", shipped: "bg-indigo-100 text-indigo-700",
  delivered: "bg-green-100 text-green-700", cancelled: "bg-red-100 text-red-700",
  refunded: "bg-gray-100 text-gray-600",
};

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder]   = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);

  useEffect(() => {
    fetch(`/api/admin/orders/${id}`).then(r => r.json()).then(d => {
      setOrder(d.order); setLoading(false);
    });
  }, [id]);

  async function updateStatus(status: string) {
    setSaving(true);
    const res = await fetch(`/api/admin/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const d = await res.json();
    setOrder(d.order);
    setSaving(false);
  }

  if (loading) return <div className="flex-1 flex items-center justify-center min-h-screen bg-fluno-light"><Loader2 size={28} className="animate-spin text-fluno-purple" /></div>;
  if (!order)  return <div className="flex-1 flex items-center justify-center min-h-screen bg-fluno-light"><p className="text-fluno-muted">Order not found.</p></div>;

  return (
    <div className="flex-1 p-6 lg:p-10 bg-fluno-light min-h-screen">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/orders" className="p-2 rounded-xl text-fluno-muted hover:bg-fluno-lavender transition-colors"><ArrowLeft size={20} /></Link>
        <div className="flex-1">
          <h1 className="font-display text-2xl text-fluno-ink">{order.orderId}</h1>
          <p className="font-mono text-xs text-fluno-muted mt-0.5">{new Date(order.createdAt).toLocaleString("en-IN")}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`inline-block text-xs font-mono px-3 py-1.5 rounded-full capitalize font-semibold ${statusColors[order.status] ?? "bg-gray-100 text-gray-500"}`}>
            {order.status}
          </span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left — items + payment */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <div className="bg-white rounded-2xl border border-fluno-lavender overflow-hidden">
            <div className="px-5 py-4 border-b border-fluno-lavender">
              <h2 className="font-display text-base text-fluno-ink">Items</h2>
            </div>
            <div className="divide-y divide-fluno-lavender/40">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-4">
                  {item.image && (
                    <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover border border-fluno-lavender" />
                  )}
                  <div className="flex-1">
                    <p className="font-body font-medium text-fluno-ink">{item.name}</p>
                    <p className="font-mono text-xs text-fluno-muted">{item.size}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-body text-sm text-fluno-muted">×{item.quantity}</p>
                    <p className="font-brand font-semibold text-fluno-ink">₹{(item.price * item.quantity).toLocaleString("en-IN")}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-5 py-4 border-t border-fluno-lavender bg-fluno-light/50 space-y-1.5">
              {[
                ["Subtotal",   `₹${order.subtotal?.toLocaleString("en-IN")}`],
                ["Shipping",   `₹${order.shipping?.toLocaleString("en-IN")}`],
                ...(order.discount ? [["Discount", `-₹${order.discount?.toLocaleString("en-IN")}${order.coupon ? ` (${order.coupon})` : ""}`]] : []),
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between text-sm">
                  <span className="text-fluno-muted">{k}</span>
                  <span className="text-fluno-ink font-body">{v}</span>
                </div>
              ))}
              <div className="flex justify-between pt-2 border-t border-fluno-lavender mt-2">
                <span className="font-brand font-semibold text-fluno-ink">Total</span>
                <span className="font-brand font-bold text-xl text-fluno-purple">₹{order.total?.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>

          {/* Payment info */}
          <div className="bg-white rounded-2xl border border-fluno-lavender p-5 space-y-2">
            <h2 className="font-display text-base text-fluno-ink border-b border-fluno-lavender pb-3 mb-3">Payment</h2>
            {[
              ["Razorpay Order ID", order.razorpayOrderId || "—"],
              ["Payment ID",        order.paymentId       || "—"],
            ].map(([k, v]) => (
              <div key={k} className="flex gap-4 text-sm">
                <span className="text-fluno-muted w-40 flex-shrink-0">{k}</span>
                <span className="font-mono text-fluno-ink text-xs break-all">{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right — customer + update */}
        <div className="space-y-6">
          {/* Customer */}
          <div className="bg-white rounded-2xl border border-fluno-lavender p-5">
            <h2 className="font-display text-base text-fluno-ink border-b border-fluno-lavender pb-3 mb-3">Customer</h2>
            <div className="space-y-2 text-sm">
              {[
                ["Name",     order.address?.name    ],
                ["Email",    order.address?.email   ],
                ["Phone",    order.address?.phone   ],
                ["Address",  order.address?.address ],
                ["City",     order.address?.city    ],
                ["State",    order.address?.state   ],
                ["Pincode",  order.address?.pincode ],
              ].map(([k, v]) => (
                <div key={k} className="flex gap-3">
                  <span className="text-fluno-muted w-20 flex-shrink-0 text-xs">{k}</span>
                  <span className="font-body text-fluno-ink text-xs">{v || "—"}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Update status */}
          <div className="bg-white rounded-2xl border border-fluno-lavender p-5">
            <h2 className="font-display text-base text-fluno-ink border-b border-fluno-lavender pb-3 mb-4">Update Status</h2>
            <div className="space-y-2">
              {STATUSES.map(s => (
                <button
                  key={s}
                  disabled={s === order.status || saving}
                  onClick={() => updateStatus(s)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-body capitalize transition-all ${
                    s === order.status
                      ? "bg-fluno-purple text-white font-semibold cursor-default"
                      : "bg-fluno-light text-fluno-muted hover:bg-fluno-lavender hover:text-fluno-purple"
                  }`}
                >
                  {saving && s !== order.status ? "" : s}
                  {s === order.status && " ✓"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
