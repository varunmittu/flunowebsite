"use client";

import { X, Plus, Minus, ShoppingBag, Tag, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRef, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { autoAnimate } from "@formkit/auto-animate";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, total, itemCount } = useCart();
  const listRef = useRef<HTMLDivElement>(null);

  // Wire up auto-animate on the cart items list
  useEffect(() => {
    if (listRef.current) {
      autoAnimate(listRef.current, { duration: 200, easing: "ease-out" });
    }
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-fluno-dark/65 backdrop-blur-sm"
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="fixed right-0 top-0 h-full w-full max-w-sm z-50 flex flex-col shadow-2xl"
            style={{ background: "linear-gradient(160deg, #0D0618 0%, #130822 100%)" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-fluno-purple/15 flex items-center justify-center">
                  <ShoppingBag size={15} className="text-fluno-purple" />
                </div>
                <h2 className="font-display text-lg text-white">
                  Your Cart
                  {itemCount > 0 && (
                    <span className="ml-2 font-mono text-sm text-fluno-purple">({itemCount})</span>
                  )}
                </h2>
              </div>
              <button
                onClick={closeCart}
                className="p-2 text-white/35 hover:text-white hover:bg-white/10 transition-all rounded-xl"
                aria-label="Close cart"
              >
                <X size={18} />
              </button>
            </div>

            {/* Items — auto-animate applied to this div */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-5 text-center">
                  <div className="w-20 h-20 rounded-2xl bg-fluno-purple/10 border border-fluno-purple/20 flex items-center justify-center">
                    <ShoppingBag size={32} className="text-fluno-purple/40" />
                  </div>
                  <div>
                    <p className="font-display text-white/80 font-semibold">Your cart is empty</p>
                    <p className="font-body text-sm text-white/35 mt-1">Add something you love</p>
                  </div>
                  <Link href="/shop" onClick={closeCart} className="btn-primary text-sm">
                    Browse Products <ArrowRight size={14} />
                  </Link>
                </div>
              ) : (
                <div ref={listRef} className="space-y-3">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-3 p-3 rounded-2xl border border-white/8 bg-white/5 hover:bg-white/8 transition-colors"
                    >
                      <div className="w-18 h-18 min-w-[72px] bg-white/5 rounded-xl overflow-hidden border border-white/10">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={72}
                          height={72}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-display text-sm font-semibold text-white truncate">{item.name}</p>
                        <p className="font-mono text-[11px] text-white/30 mt-0.5">{item.size}</p>
                        <p className="font-brand font-bold text-sm text-fluno-purple mt-1">₹{item.price.toLocaleString("en-IN")}</p>

                        <div className="flex items-center gap-2 mt-2.5">
                          {/* Qty controls */}
                          <div className="flex items-center border border-white/15 rounded-lg overflow-hidden">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-7 h-7 flex items-center justify-center text-white/50 hover:bg-white/10 hover:text-white transition-all"
                            >
                              <Minus size={11} />
                            </button>
                            <span className="font-mono text-sm text-white w-7 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-7 h-7 flex items-center justify-center text-white/50 hover:bg-white/10 hover:text-white transition-all"
                            >
                              <Plus size={11} />
                            </button>
                          </div>

                          <button
                            onClick={() => removeItem(item.id)}
                            className="ml-auto font-mono text-[11px] text-white/20 hover:text-red-400 transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-5 py-5 border-t border-white/10 space-y-3">
                {/* Coupon stub */}
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-dashed border-white/15 text-white/30 hover:border-fluno-purple/40 hover:text-fluno-purple/60 transition-all cursor-pointer group">
                  <Tag size={13} className="group-hover:text-fluno-purple/60" />
                  <span className="font-mono text-xs">Add coupon code</span>
                </div>

                {/* Total */}
                <div className="flex justify-between items-center py-1">
                  <span className="font-body text-sm text-white/50">Subtotal</span>
                  <span className="font-brand font-bold text-xl text-white">₹{total.toLocaleString("en-IN")}</span>
                </div>
                <p className="font-mono text-[10px] text-white/20">Taxes and shipping calculated at checkout.</p>

                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="btn-primary w-full text-center shadow-lg shadow-fluno-purple/25"
                >
                  Checkout — ₹{total.toLocaleString("en-IN")}
                </Link>
                <Link
                  href="/cart"
                  onClick={closeCart}
                  className="btn-outline-white w-full text-center text-sm"
                >
                  View Full Cart
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
