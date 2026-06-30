"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, ChevronRight } from "lucide-react";
import { useCart } from "@/context/CartContext";

type Step = "address" | "review" | "payment";

export default function CheckoutPage() {
  const { items, total } = useCart();
  const [step, setStep] = useState<Step>("address");
  const shipping = total >= 499 ? 0 : 49;
  const finalTotal = total + shipping;

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "Telangana",
    pincode: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <p className="font-body text-fluno-ink/50 mb-4">
          Your cart is empty. Add products before checking out.
        </p>
        <Link href="/shop" className="btn-primary">
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Progress */}
      <nav className="flex items-center gap-2 text-sm font-body mb-10 flex-wrap">
        {(["address", "review", "payment"] as Step[]).map((s, i, arr) => (
          <div key={s} className="flex items-center gap-2">
            <span
              className={`font-medium ${
                step === s
                  ? "text-fluno-teal"
                  : i < arr.indexOf(step)
                  ? "text-fluno-ink/40 line-through"
                  : "text-fluno-ink/30"
              }`}
            >
              {i + 1}. {s.charAt(0).toUpperCase() + s.slice(1)}
            </span>
            {i < arr.length - 1 && (
              <ChevronRight size={14} className="text-fluno-ink/20" />
            )}
          </div>
        ))}
      </nav>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Form */}
        <div className="lg:col-span-2">
          {step === "address" && (
            <div>
              <h1 className="font-display text-2xl text-fluno-ink mb-6">
                Delivery Address
              </h1>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-body text-sm text-fluno-ink/70 mb-1">
                    Full Name *
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="input"
                    placeholder="Priya Sharma"
                  />
                </div>
                <div>
                  <label className="block font-body text-sm text-fluno-ink/70 mb-1">
                    Email *
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    className="input"
                    placeholder="priya@email.com"
                  />
                </div>
                <div>
                  <label className="block font-body text-sm text-fluno-ink/70 mb-1">
                    Phone *
                  </label>
                  <input
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    className="input"
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-body text-sm text-fluno-ink/70 mb-1">
                    Address *
                  </label>
                  <input
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    className="input"
                    placeholder="House no., Street, Area"
                  />
                </div>
                <div>
                  <label className="block font-body text-sm text-fluno-ink/70 mb-1">
                    City *
                  </label>
                  <input
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    className="input"
                    placeholder="Hyderabad"
                  />
                </div>
                <div>
                  <label className="block font-body text-sm text-fluno-ink/70 mb-1">
                    Pincode *
                  </label>
                  <input
                    name="pincode"
                    value={form.pincode}
                    onChange={handleChange}
                    className="input"
                    placeholder="500090"
                    maxLength={6}
                  />
                </div>
                <div>
                  <label className="block font-body text-sm text-fluno-ink/70 mb-1">
                    State *
                  </label>
                  <select
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    className="input"
                  >
                    {["Telangana", "Andhra Pradesh", "Karnataka", "Tamil Nadu", "Maharashtra", "Delhi", "Gujarat", "Rajasthan", "Other"].map(
                      (s) => (
                        <option key={s}>{s}</option>
                      )
                    )}
                  </select>
                </div>
              </div>
              <button
                onClick={() => setStep("review")}
                className="btn-primary mt-8"
              >
                Continue to Review
              </button>
            </div>
          )}

          {step === "review" && (
            <div>
              <h1 className="font-display text-2xl text-fluno-ink mb-6">
                Review Order
              </h1>
              <div className="card p-5 mb-4">
                <p className="font-body text-sm text-fluno-ink/50 mb-1">
                  Delivering to
                </p>
                <p className="font-body text-sm text-fluno-ink font-medium">
                  {form.name}
                </p>
                <p className="font-body text-sm text-fluno-ink/70">
                  {form.address}, {form.city}, {form.state} — {form.pincode}
                </p>
                <p className="font-body text-sm text-fluno-ink/70">
                  {form.phone}
                </p>
                <button
                  onClick={() => setStep("address")}
                  className="text-xs text-fluno-teal hover:underline mt-2 font-body"
                >
                  Edit
                </button>
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
                    <p className="font-display text-sm text-fluno-teal font-medium">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </p>
                  </div>
                ))}
              </div>
              <button onClick={() => setStep("payment")} className="btn-primary">
                Continue to Payment
              </button>
            </div>
          )}

          {step === "payment" && (
            <div>
              <h1 className="font-display text-2xl text-fluno-ink mb-6">
                Payment
              </h1>
              <div className="card p-6 text-center space-y-4">
                <ShieldCheck size={32} className="text-fluno-teal mx-auto" />
                <p className="font-display text-lg text-fluno-ink">
                  Secure Payment via Razorpay
                </p>
                <p className="font-body text-sm text-fluno-ink/60">
                  UPI · Credit / Debit Card · Net Banking · Wallets
                </p>
                <div className="bg-fluno-teal/5 border border-fluno-teal/20 rounded-sm p-4 text-left">
                  <p className="font-mono text-xs text-fluno-ink/50">
                    ⚙️ Razorpay integration requires{" "}
                    <code className="bg-fluno-stone/40 px-1 rounded">NEXT_PUBLIC_RAZORPAY_KEY_ID</code>{" "}
                    and{" "}
                    <code className="bg-fluno-stone/40 px-1 rounded">RAZORPAY_KEY_SECRET</code>{" "}
                    in .env.local. See README for setup instructions.
                  </p>
                </div>
                <button className="btn-primary w-full text-base py-4">
                  Pay ₹{finalTotal.toLocaleString("en-IN")} →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Summary Sidebar */}
        <div className="card p-5 h-fit">
          <h2 className="font-display text-lg text-fluno-ink mb-4">
            Order Summary
          </h2>
          <div className="space-y-2 text-sm font-body text-fluno-ink/70 mb-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{total.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{shipping === 0 ? <span className="text-fluno-teal">Free</span> : `₹${shipping}`}</span>
            </div>
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
