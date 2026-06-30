"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, ChevronRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type Step = "address" | "review" | "payment";

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill: { name: string; email: string; contact: string };
  theme: { color: string };
  modal: { ondismiss: () => void };
}

interface RazorpayInstance {
  open: () => void;
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const { data: session } = useSession();
  const router = useRouter();
  const [step, setStep] = useState<Step>("address");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const shipping = total >= 499 ? 0 : 49;
  const finalTotal = total + shipping;

  const [form, setForm] = useState({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "Telangana",
    pincode: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handlePayment() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.id,
            name: i.name,
            size: i.size,
            price: i.price,
            quantity: i.quantity,
            image: i.image,
          })),
          address: form,
          subtotal: total,
          shipping,
          total: finalTotal,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Order creation failed");

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      document.body.appendChild(script);

      script.onload = () => {
        const rzp = new window.Razorpay({
          key: data.keyId,
          amount: data.amount,
          currency: data.currency,
          name: "Fluno",
          description: "Personal Care Products",
          order_id: data.razorpayOrderId,
          handler: async (response: RazorpayResponse) => {
            const verifyRes = await fetch("/api/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: data.orderId,
              }),
            });
            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              clearCart();
              router.push(`/order-success?orderId=${data.orderId}`);
            } else {
              setError("Payment verification failed. Contact support.");
            }
          },
          prefill: { name: form.name, email: form.email, contact: form.phone },
          theme: { color: "#1E5C56" },
          modal: { ondismiss: () => setLoading(false) },
        });
        rzp.open();
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <p className="font-body text-fluno-ink/50 mb-4">Your cart is empty.</p>
        <Link href="/shop" className="btn-primary">Shop Now</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Progress */}
      <nav className="flex items-center gap-2 text-sm font-body mb-10 flex-wrap">
        {(["address", "review", "payment"] as Step[]).map((s, i, arr) => (
          <div key={s} className="flex items-center gap-2">
            <span className={`font-medium ${step === s ? "text-fluno-teal" : i < arr.indexOf(step) ? "text-fluno-ink/40 line-through" : "text-fluno-ink/30"}`}>
              {i + 1}. {s.charAt(0).toUpperCase() + s.slice(1)}
            </span>
            {i < arr.length - 1 && <ChevronRight size={14} className="text-fluno-ink/20" />}
          </div>
        ))}
      </nav>

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          {step === "address" && (
            <div>
              <h1 className="font-display text-2xl text-fluno-ink mb-6">Delivery Address</h1>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-body text-sm text-fluno-ink/70 mb-1">Full Name *</label>
                  <input name="name" value={form.name} onChange={handleChange} className="input" placeholder="Priya Sharma" />
                </div>
                <div>
                  <label className="block font-body text-sm text-fluno-ink/70 mb-1">Email *</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} className="input" placeholder="priya@email.com" />
                </div>
                <div>
                  <label className="block font-body text-sm text-fluno-ink/70 mb-1">Phone *</label>
                  <input name="phone" type="tel" value={form.phone} onChange={handleChange} className="input" placeholder="98765 43210" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-body text-sm text-fluno-ink/70 mb-1">Address *</label>
                  <input name="address" value={form.address} onChange={handleChange} className="input" placeholder="House no., Street, Area" />
                </div>
                <div>
                  <label className="block font-body text-sm text-fluno-ink/70 mb-1">City *</label>
                  <input name="city" value={form.city} onChange={handleChange} className="input" placeholder="Hyderabad" />
                </div>
                <div>
                  <label className="block font-body text-sm text-fluno-ink/70 mb-1">Pincode *</label>
                  <input name="pincode" value={form.pincode} onChange={handleChange} className="input" placeholder="500090" maxLength={6} />
                </div>
                <div>
                  <label className="block font-body text-sm text-fluno-ink/70 mb-1">State *</label>
                  <select name="state" value={form.state} onChange={handleChange} className="input">
                    {["Telangana","Andhra Pradesh","Karnataka","Tamil Nadu","Maharashtra","Delhi","Gujarat","Rajasthan","Other"].map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <button onClick={() => setStep("review")} disabled={!form.name || !form.email || !form.phone || !form.address || !form.city || !form.pincode} className="btn-primary mt-8 disabled:opacity-50">
                Continue to Review
              </button>
            </div>
          )}

          {step === "review" && (
            <div>
              <h1 className="font-display text-2xl text-fluno-ink mb-6">Review Order</h1>
              <div className="card p-5 mb-4">
                <p className="font-body text-sm text-fluno-ink/50 mb-1">Delivering to</p>
                <p className="font-body text-sm text-fluno-ink font-medium">{form.name}</p>
                <p className="font-body text-sm text-fluno-ink/70">{form.address}, {form.city}, {form.state} — {form.pincode}</p>
                <p className="font-body text-sm text-fluno-ink/70">{form.phone}</p>
                <button onClick={() => setStep("address")} className="text-xs text-fluno-teal hover:underline mt-2 font-body">Edit</button>
              </div>
              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 card p-3">
                    <div className="w-12 h-12 bg-fluno-stone/20 rounded-sm overflow-hidden flex-shrink-0 relative">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="font-body text-sm text-fluno-ink">{item.name}</p>
                      <p className="font-mono text-xs text-fluno-ink/40">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-display text-sm text-fluno-teal font-medium">₹{(item.price * item.quantity).toLocaleString("en-IN")}</p>
                  </div>
                ))}
              </div>
              <button onClick={() => setStep("payment")} className="btn-primary">Continue to Payment</button>
            </div>
          )}

          {step === "payment" && (
            <div>
              <h1 className="font-display text-2xl text-fluno-ink mb-6">Payment</h1>
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-sm text-sm text-red-700 font-body">
                  {error}
                </div>
              )}
              <div className="card p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <ShieldCheck size={24} className="text-fluno-teal" />
                  <div>
                    <p className="font-display text-base text-fluno-ink">Secure Payment via Razorpay</p>
                    <p className="font-body text-sm text-fluno-ink/60">UPI · Card · Net Banking · Wallets</p>
                  </div>
                </div>
                <button onClick={handlePayment} disabled={loading} className="btn-primary w-full text-base py-4">
                  {loading ? "Opening payment…" : `Pay ₹${finalTotal.toLocaleString("en-IN")} →`}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="card p-5 h-fit">
          <h2 className="font-display text-lg text-fluno-ink mb-4">Order Summary</h2>
          <div className="space-y-2 text-sm font-body text-fluno-ink/70 mb-4">
            <div className="flex justify-between"><span>Subtotal</span><span>₹{total.toLocaleString("en-IN")}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? <span className="text-fluno-teal">Free</span> : `₹${shipping}`}</span></div>
          </div>
          <div className="divider mb-4" />
          <div className="flex justify-between font-display text-lg text-fluno-ink">
            <span>Total</span>
            <span className="text-fluno-teal">₹{finalTotal.toLocaleString("en-IN")}</span>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs font-mono text-fluno-ink/40">
            <ShieldCheck size={13} className="text-fluno-teal" />
            SSL encrypted · 100% secure checkout
          </div>
        </div>
      </div>
    </div>
  );
}
