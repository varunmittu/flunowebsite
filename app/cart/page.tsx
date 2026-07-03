"use client";

import Link from "next/link";
import Image from "next/image";
import { Plus, Minus, X, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, itemCount, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-fig-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <ShoppingBag size={56} className="text-fig-navy/20 mx-auto mb-5" />
          <h1 className="font-fig font-bold text-3xl md:text-4xl text-fig-navy mb-3">Your cart is empty</h1>
          <p className="font-fig-body text-fig-ink-soft mb-8">Browse our products and add something you love.</p>
          <Link href="/shop" className="fig-btn">
            Shop Now <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  const shipping = total >= 499 ? 0 : 49;
  const finalTotal = total + shipping;

  return (
    <div className="min-h-screen bg-fig-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-fig font-bold text-3xl md:text-4xl text-fig-navy">
            Your Cart{" "}
            <span className="font-fig-body text-fig-terracotta text-2xl">({itemCount})</span>
          </h1>
          <button
            onClick={clearCart}
            className="text-xs text-fig-ink-soft/60 hover:text-fig-terracotta transition-colors font-fig-body"
          >
            Clear all
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-fig-paper border border-fig-navy/10 rounded-2xl p-4 flex gap-5">
                <div className="w-24 h-24 bg-fig-sage/15 rounded-xl overflow-hidden flex-shrink-0 relative">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-fig font-bold text-base text-fig-navy">
                        {item.name}
                      </h3>
                      <p className="font-fig-body text-xs text-fig-ink-soft/60 mt-0.5">
                        {item.size}
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-fig-ink-soft/40 hover:text-fig-terracotta transition-colors p-1"
                      aria-label="Remove item"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center border border-fig-navy/15 rounded-lg overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-3 py-2 text-fig-ink-soft hover:text-fig-terracotta hover:bg-fig-navy/5 transition-colors"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="px-4 font-fig-body text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-3 py-2 text-fig-ink-soft hover:text-fig-terracotta hover:bg-fig-navy/5 transition-colors"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <p className="font-fig font-bold text-lg text-fig-terracotta tabular-nums">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="bg-fig-paper border border-fig-navy/10 rounded-2xl p-6 h-fit">
            <h2 className="font-fig font-bold text-xl text-fig-navy mb-5">
              Order Summary
            </h2>

            <div className="space-y-3 text-sm font-fig-body">
              <div className="flex justify-between text-fig-ink-soft">
                <span>
                  Subtotal ({itemCount} item{itemCount !== 1 ? "s" : ""})
                </span>
                <span className="tabular-nums">₹{total.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-fig-ink-soft">
                <span>Shipping</span>
                <span>
                  {shipping === 0 ? (
                    <span className="text-fig-sage font-semibold">Free</span>
                  ) : (
                    `₹${shipping}`
                  )}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-fig-ink-soft/60">
                  Free shipping on orders above ₹499
                </p>
              )}
            </div>

            {/* Coupon */}
            <div className="mt-5 flex gap-2">
              <input
                type="text"
                placeholder="Coupon code"
                className="fig-input py-2 text-sm flex-1"
              />
              <button className="fig-btn-outline py-2 px-4 text-sm">Apply</button>
            </div>

            <div className="border-t border-fig-navy/10 my-5" />

            <div className="flex justify-between font-fig font-bold text-xl text-fig-navy">
              <span>Total</span>
              <span className="text-fig-terracotta tabular-nums">
                ₹{finalTotal.toLocaleString("en-IN")}
              </span>
            </div>
            <p className="font-fig-body text-xs text-fig-ink-soft/60 mt-1">
              Incl. all taxes
            </p>

            <Link href="/checkout" className="fig-btn w-full mt-6 text-center">
              Proceed to Checkout <ArrowRight size={15} />
            </Link>

            <Link
              href="/shop"
              className="flex items-center justify-center w-full mt-3 text-center text-sm text-fig-ink-soft hover:text-fig-terracotta font-fig-body py-2 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
