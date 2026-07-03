"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, ChevronRight, Tag, X, Loader2, MapPin, Check } from "lucide-react";
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

  const [couponInput, setCouponInput]   = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [couponError, setCouponError]   = useState("");
  const [couponLoading, setCouponLoading] = useState(false);

  const shipping = total >= 499 ? 0 : 49;
  const discount = appliedCoupon?.discount ?? 0;
  const finalTotal = Math.max(total + shipping - discount, 1);

  async function applyCoupon() {
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    setCouponError("");
    try {
      const res  = await fetch("/api/coupons/validate", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ code: couponInput.trim(), subtotal: total }),
      });
      const data = await res.json();
      if (!res.ok) {
        setCouponError(data.error || "Invalid coupon.");
        return;
      }
      setAppliedCoupon({ code: data.code, discount: data.discount });
      setCouponInput("");
    } catch {
      setCouponError("Could not validate coupon. Try again.");
    } finally {
      setCouponLoading(false);
    }
  }

  const [form, setForm] = useState({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "Telangana",
    pincode: "",
  });

  interface SavedAddress {
    _id: string; label?: string; name: string; address: string;
    city: string; state: string; pincode: string; phone?: string; isDefault?: boolean;
  }
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddrId, setSelectedAddrId] = useState<string | null>(null);

  useEffect(() => {
    if (!session?.user) return;
    fetch("/api/addresses")
      .then((r) => r.json())
      .then((d) => {
        const list: SavedAddress[] = d.addresses ?? [];
        setSavedAddresses(list);
        const def = list.find((a) => a.isDefault) ?? list[0];
        if (def) applySavedAddress(def);
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user]);

  function applySavedAddress(a: SavedAddress) {
    setSelectedAddrId(a._id);
    setForm((f) => ({
      ...f,
      name:    a.name,
      phone:   a.phone ?? f.phone,
      address: a.address,
      city:    a.city,
      state:   a.state,
      pincode: a.pincode,
    }));
  }

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
            quantity: i.quantity,
          })),
          address: form,
          coupon: appliedCoupon?.code ?? null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Order creation failed");

      const openRazorpay = () => {
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
              setLoading(false);
            }
          },
          prefill: { name: form.name, email: form.email, contact: form.phone },
          theme: { color: "#D9814F" },
          modal: { ondismiss: () => setLoading(false) },
        });
        rzp.open();
      };

      if (window.Razorpay) {
        openRazorpay();
      } else {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = openRazorpay;
        script.onerror = () => {
          setError("Could not load the payment gateway. Check your connection and try again.");
          setLoading(false);
        };
        document.body.appendChild(script);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-fig-cream">
        <div className="max-w-xl mx-auto px-4 py-20 text-center">
          <p className="font-fig-body text-fig-ink-soft mb-4">Your cart is empty.</p>
          <Link href="/shop" className="fig-btn">Shop Now</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-fig-cream">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Progress */}
      <nav className="flex items-center gap-2 text-sm font-fig-body mb-10 flex-wrap">
        {(["address", "review", "payment"] as Step[]).map((s, i, arr) => (
          <div key={s} className="flex items-center gap-2">
            <span className={`font-fig font-semibold ${step === s ? "text-fig-terracotta" : i < arr.indexOf(step) ? "text-fig-ink-soft/50 line-through" : "text-fig-ink-soft/50"}`}>
              {i + 1}. {s.charAt(0).toUpperCase() + s.slice(1)}
            </span>
            {i < arr.length - 1 && <ChevronRight size={14} className="text-fig-navy/25" />}
          </div>
        ))}
      </nav>

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          {step === "address" && (
            <div>
              <h1 className="font-fig font-bold text-2xl text-fig-navy mb-6">Delivery Address</h1>

              {savedAddresses.length > 0 && (
                <div className="mb-8">
                  <p className="font-fig font-semibold text-xs text-fig-ink-soft uppercase tracking-wide mb-3">Your saved addresses</p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {savedAddresses.map((a) => {
                      const active = selectedAddrId === a._id;
                      return (
                        <button
                          key={a._id}
                          type="button"
                          onClick={() => applySavedAddress(a)}
                          className={`text-left p-4 rounded-xl border transition-all ${
                            active
                              ? "border-fig-terracotta bg-fig-terracotta/5 shadow-sm"
                              : "border-fig-navy/12 bg-fig-paper hover:border-fig-terracotta/40"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="flex items-center gap-1.5 font-fig font-semibold text-[10px] uppercase tracking-wide text-fig-terracotta">
                              <MapPin size={11} /> {a.label ?? "Address"}
                              {a.isDefault && <span className="text-fig-ink-soft/50">· default</span>}
                            </span>
                            {active && <Check size={14} className="text-fig-terracotta" />}
                          </div>
                          <p className="font-fig-body text-sm font-medium text-fig-navy">{a.name}</p>
                          <p className="font-fig-body text-xs text-fig-ink-soft leading-relaxed mt-0.5">
                            {a.address}, {a.city}, {a.state} — {a.pincode}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                  <p className="font-fig-body text-[10px] text-fig-ink-soft/60 mt-3">
                    Selecting fills the form below — you can still edit any field.
                  </p>
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-fig-body text-sm text-fig-ink-soft mb-1">Full Name *</label>
                  <input name="name" value={form.name} onChange={handleChange} className="fig-input" placeholder="Priya Sharma" />
                </div>
                <div>
                  <label className="block font-fig-body text-sm text-fig-ink-soft mb-1">Email *</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} className="fig-input" placeholder="priya@email.com" />
                </div>
                <div>
                  <label className="block font-fig-body text-sm text-fig-ink-soft mb-1">Phone *</label>
                  <input name="phone" type="tel" value={form.phone} onChange={handleChange} className="fig-input" placeholder="98765 43210" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-fig-body text-sm text-fig-ink-soft mb-1">Address *</label>
                  <input name="address" value={form.address} onChange={handleChange} className="fig-input" placeholder="House no., Street, Area" />
                </div>
                <div>
                  <label className="block font-fig-body text-sm text-fig-ink-soft mb-1">City *</label>
                  <input name="city" value={form.city} onChange={handleChange} className="fig-input" placeholder="Your city" />
                </div>
                <div>
                  <label className="block font-fig-body text-sm text-fig-ink-soft mb-1">Pincode *</label>
                  <input name="pincode" value={form.pincode} onChange={handleChange} className="fig-input" placeholder="500090" maxLength={6} />
                </div>
                <div>
                  <label className="block font-fig-body text-sm text-fig-ink-soft mb-1">State *</label>
                  <select name="state" value={form.state} onChange={handleChange} className="fig-input">
                    {["Telangana","Andhra Pradesh","Karnataka","Tamil Nadu","Maharashtra","Delhi","Gujarat","Rajasthan","Other"].map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <button onClick={() => setStep("review")} disabled={!form.name || !form.email || !form.phone || !form.address || !form.city || !form.pincode} className="fig-btn mt-8 disabled:opacity-50">
                Continue to Review
              </button>
            </div>
          )}

          {step === "review" && (
            <div>
              <h1 className="font-fig font-bold text-2xl text-fig-navy mb-6">Review Order</h1>
              <div className="bg-fig-paper border border-fig-navy/10 rounded-2xl p-5 mb-4">
                <p className="font-fig-body text-sm text-fig-ink-soft mb-1">Delivering to</p>
                <p className="font-fig-body text-sm text-fig-navy font-medium">{form.name}</p>
                <p className="font-fig-body text-sm text-fig-ink-soft">{form.address}, {form.city}, {form.state} — {form.pincode}</p>
                <p className="font-fig-body text-sm text-fig-ink-soft">{form.phone}</p>
                <button onClick={() => setStep("address")} className="text-xs text-fig-terracotta hover:underline mt-2 font-fig-body">Edit</button>
              </div>
              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 bg-fig-paper border border-fig-navy/10 rounded-2xl p-3">
                    <div className="w-12 h-12 bg-fig-sage/15 rounded-lg overflow-hidden flex-shrink-0 relative">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="font-fig-body text-sm text-fig-navy">{item.name}</p>
                      <p className="font-fig-body text-xs text-fig-ink-soft/60">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-fig font-bold text-sm text-fig-terracotta tabular-nums">₹{(item.price * item.quantity).toLocaleString("en-IN")}</p>
                  </div>
                ))}
              </div>
              <button onClick={() => setStep("payment")} className="fig-btn">Continue to Payment</button>
            </div>
          )}

          {step === "payment" && (
            <div>
              <h1 className="font-fig font-bold text-2xl text-fig-navy mb-6">Payment</h1>
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 font-fig-body">
                  {error}
                </div>
              )}
              <div className="bg-fig-paper border border-fig-navy/10 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <ShieldCheck size={24} className="text-fig-sage" />
                  <div>
                    <p className="font-fig font-bold text-base text-fig-navy">Secure Payment via Razorpay</p>
                    <p className="font-fig-body text-sm text-fig-ink-soft">UPI · Card · Net Banking · Wallets</p>
                  </div>
                </div>
                <button onClick={handlePayment} disabled={loading} className="fig-btn w-full text-base py-4">
                  {loading ? "Opening payment…" : `Pay ₹${finalTotal.toLocaleString("en-IN")} →`}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="bg-fig-paper border border-fig-navy/10 rounded-2xl p-5 h-fit">
          <h2 className="font-fig font-bold text-lg text-fig-navy mb-4">Order Summary</h2>

          {/* Coupon */}
          <div className="mb-4">
            {appliedCoupon ? (
              <div className="flex items-center justify-between p-2.5 bg-fig-sage/15 border border-fig-sage/40 rounded-lg">
                <span className="flex items-center gap-1.5 font-fig-body text-xs text-fig-navy">
                  <Tag size={12} /> {appliedCoupon.code} applied — you save ₹{appliedCoupon.discount.toLocaleString("en-IN")}
                </span>
                <button
                  onClick={() => setAppliedCoupon(null)}
                  className="text-fig-navy/50 hover:text-fig-terracotta transition-colors"
                  aria-label="Remove coupon"
                >
                  <X size={13} />
                </button>
              </div>
            ) : (
              <>
                <div className="flex gap-2">
                  <input
                    value={couponInput}
                    onChange={(e) => { setCouponInput(e.target.value.toUpperCase()); setCouponError(""); }}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); applyCoupon(); } }}
                    placeholder="Coupon code"
                    className="fig-input flex-1 text-xs uppercase"
                  />
                  <button
                    onClick={applyCoupon}
                    disabled={!couponInput.trim() || couponLoading}
                    className="fig-btn-outline text-xs px-4 disabled:opacity-50 flex-shrink-0"
                  >
                    {couponLoading ? <Loader2 size={13} className="animate-spin" /> : "Apply"}
                  </button>
                </div>
                {couponError && (
                  <p className="font-fig-body text-xs text-red-600 mt-1.5">{couponError}</p>
                )}
              </>
            )}
          </div>

          <div className="space-y-2 text-sm font-fig-body text-fig-ink-soft mb-4">
            <div className="flex justify-between"><span>Subtotal</span><span className="tabular-nums">₹{total.toLocaleString("en-IN")}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? <span className="text-fig-sage">Free</span> : `₹${shipping}`}</span></div>
            {discount > 0 && (
              <div className="flex justify-between text-fig-sage"><span>Discount ({appliedCoupon?.code})</span><span>−₹{discount.toLocaleString("en-IN")}</span></div>
            )}
          </div>
          <div className="border-t border-fig-navy/10 mb-4" />
          <div className="flex justify-between font-fig font-bold text-lg text-fig-navy">
            <span>Total</span>
            <span className="text-fig-terracotta tabular-nums">₹{finalTotal.toLocaleString("en-IN")}</span>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs font-fig-body text-fig-ink-soft/70">
            <ShieldCheck size={13} className="text-fig-sage" />
            SSL encrypted · 100% secure checkout
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
