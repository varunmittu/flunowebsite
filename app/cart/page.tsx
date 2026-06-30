"use client";

import Link from "next/link";
import Image from "next/image";
import { Plus, Minus, X, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, itemCount, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <ShoppingBag size={56} className="text-fluno-stone mx-auto mb-5" />
        <h1 className="section-title mb-3">Your cart is empty</h1>
        <p className="section-sub mb-8">Browse our products and add something you love.</p>
        <Link href="/shop" className="btn-primary">
          Shop Now <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  const shipping = total >= 499 ? 0 : 49;
  const finalTotal = total + shipping;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="section-title">
          Your Cart{" "}
          <span className="font-mono text-fluno-teal text-2xl">({itemCount})</span>
        </h1>
        <button
          onClick={clearCart}
          className="text-xs text-fluno-ink/40 hover:text-red-500 transition-colors font-body"
        >
          Clear all
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="card p-4 flex gap-5">
              <div className="w-24 h-24 bg-fluno-stone/20 rounded-sm overflow-hidden flex-shrink-0 relative">
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
                    <h3 className="font-display text-base text-fluno-ink">
                      {item.name}
                    </h3>
                    <p className="font-mono text-xs text-fluno-ink/40 mt-0.5">
                      {item.size}
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-fluno-ink/30 hover:text-red-500 transition-colors p-1"
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center border border-fluno-stone rounded-sm overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-3 py-2 text-fluno-ink/60 hover:text-fluno-teal hover:bg-fluno-stone/20 transition-colors"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="px-4 font-mono text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-3 py-2 text-fluno-ink/60 hover:text-fluno-teal hover:bg-fluno-stone/20 transition-colors"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                  <p className="font-display text-lg text-fluno-teal font-medium">
                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="card p-6 h-fit">
          <h2 className="font-display text-xl text-fluno-ink mb-5">
            Order Summary
          </h2>

          <div className="space-y-3 text-sm font-body">
            <div className="flex justify-between text-fluno-ink/70">
              <span>
                Subtotal ({itemCount} item{itemCount !== 1 ? "s" : ""})
              </span>
              <span>₹{total.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-fluno-ink/70">
              <span>Shipping</span>
              <span>
                {shipping === 0 ? (
                  <span className="text-fluno-teal font-medium">Free</span>
                ) : (
                  `₹${shipping}`
                )}
              </span>
            </div>
            {shipping > 0 && (
              <p className="text-xs text-fluno-ink/40">
                Free shipping on orders above ₹499
              </p>
            )}
          </div>

          {/* Coupon */}
          <div className="mt-5 flex gap-2">
            <input
              type="text"
              placeholder="Coupon code"
              className="input py-2 text-sm flex-1"
            />
            <button className="btn-outline py-2 px-4 text-sm">Apply</button>
          </div>

          <div className="divider my-5" />

          <div className="flex justify-between font-display text-xl text-fluno-ink">
            <span>Total</span>
            <span className="text-fluno-teal">
              ₹{finalTotal.toLocaleString("en-IN")}
            </span>
          </div>
          <p className="font-mono text-xs text-fluno-ink/40 mt-1">
            Incl. all taxes
          </p>

          <Link href="/checkout" className="btn-primary w-full mt-6 text-center">
            Proceed to Checkout <ArrowRight size={15} />
          </Link>

          <Link
            href="/shop"
            className="btn-ghost w-full mt-3 text-center text-sm text-fluno-ink/60"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
