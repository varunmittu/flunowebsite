"use client";

import { X, Plus, Minus, ShoppingBag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, total, itemCount } =
    useCart();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
        onClick={closeCart}
      />

      {/* Drawer */}
      <aside className="fixed right-0 top-0 h-full w-full max-w-sm z-50 bg-fluno-bg flex flex-col shadow-xl animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-fluno-stone/40">
          <h2 className="font-display text-xl text-fluno-ink">
            Cart
            {itemCount > 0 && (
              <span className="ml-2 font-mono text-sm text-fluno-teal">
                ({itemCount})
              </span>
            )}
          </h2>
          <button
            onClick={closeCart}
            className="p-2 text-fluno-ink/40 hover:text-fluno-ink transition-colors"
            aria-label="Close cart"
          >
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <ShoppingBag size={40} className="text-fluno-stone" />
              <p className="font-body text-fluno-ink/50">
                Your cart is empty.
              </p>
              <Link href="/shop" onClick={closeCart} className="btn-primary text-sm">
                Browse Products
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 pb-4 border-b border-fluno-stone/30 last:border-0"
              >
                <div className="w-20 h-20 bg-fluno-stone/20 rounded-sm overflow-hidden flex-shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-body text-sm font-medium text-fluno-ink truncate">
                    {item.name}
                  </p>
                  <p className="font-mono text-xs text-fluno-ink/40 mt-0.5">
                    {item.size}
                  </p>
                  <p className="font-display text-sm font-medium text-fluno-teal mt-1">
                    ₹{item.price}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.quantity - 1)
                      }
                      className="w-6 h-6 border border-fluno-stone rounded-sm flex items-center justify-center text-fluno-ink/60 hover:border-fluno-teal hover:text-fluno-teal transition-colors"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="font-mono text-sm w-4 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.quantity + 1)
                      }
                      className="w-6 h-6 border border-fluno-stone rounded-sm flex items-center justify-center text-fluno-ink/60 hover:border-fluno-teal hover:text-fluno-teal transition-colors"
                    >
                      <Plus size={12} />
                    </button>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="ml-auto text-xs text-fluno-ink/30 hover:text-red-500 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-fluno-stone/40 space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-body text-sm text-fluno-ink/60">
                Subtotal
              </span>
              <span className="font-display text-lg font-medium text-fluno-ink">
                ₹{total.toLocaleString("en-IN")}
              </span>
            </div>
            <p className="text-xs text-fluno-ink/40">
              Shipping and taxes calculated at checkout.
            </p>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="btn-primary w-full text-center"
            >
              Checkout — ₹{total.toLocaleString("en-IN")}
            </Link>
            <Link
              href="/cart"
              onClick={closeCart}
              className="btn-ghost w-full text-center text-sm"
            >
              View Full Cart
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
