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
            className="fixed inset-0 z-40 bg-fig-navy/65 backdrop-blur-sm"
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="fixed right-0 top-0 h-full w-full max-w-sm z-50 flex flex-col shadow-2xl"
            style={{ background: "linear-gradient(160deg, #2C2A27 0%, #23211E 100%)" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-fig-cream/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-fig-terracotta/15 flex items-center justify-center">
                  <ShoppingBag size={15} className="text-fig-terracotta" />
                </div>
                <h2 className="font-fig font-bold text-lg text-fig-cream">
                  Your Cart
                  {itemCount > 0 && (
                    <span className="ml-2 font-fig-body text-sm text-fig-terracotta">({itemCount})</span>
                  )}
                </h2>
              </div>
              <button
                onClick={closeCart}
                className="p-2 text-fig-cream/35 hover:text-fig-cream hover:bg-fig-cream/10 transition-all rounded-xl"
                aria-label="Close cart"
              >
                <X size={18} />
              </button>
            </div>

            {/* Items — auto-animate applied to this div */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-5 text-center">
                  <div className="w-20 h-20 rounded-2xl bg-fig-terracotta/10 border border-fig-terracotta/20 flex items-center justify-center">
                    <ShoppingBag size={32} className="text-fig-terracotta/40" />
                  </div>
                  <div>
                    <p className="font-fig font-bold text-fig-cream/80">Your cart is empty</p>
                    <p className="font-fig-body text-sm text-fig-cream/35 mt-1">Add something you love</p>
                  </div>
                  <Link href="/shop" onClick={closeCart} className="fig-btn text-sm">
                    Browse Products <ArrowRight size={14} />
                  </Link>
                </div>
              ) : (
                <div ref={listRef} className="space-y-3">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-3 p-3 rounded-2xl border border-fig-cream/10 bg-fig-cream/5 hover:bg-fig-cream/[0.08] transition-colors"
                    >
                      <div className="w-18 h-18 min-w-[72px] bg-fig-cream/5 rounded-xl overflow-hidden border border-fig-cream/10">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={72}
                          height={72}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-fig font-bold text-sm text-fig-cream truncate">{item.name}</p>
                        <p className="font-fig-body text-[11px] text-fig-cream/30 mt-0.5">{item.size}</p>
                        <p className="font-fig font-bold text-sm text-fig-terracotta mt-1">₹{item.price.toLocaleString("en-IN")}</p>

                        <div className="flex items-center gap-2 mt-2.5">
                          {/* Qty controls */}
                          <div className="flex items-center border border-fig-cream/15 rounded-lg overflow-hidden">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-7 h-7 flex items-center justify-center text-fig-cream/50 hover:bg-fig-cream/10 hover:text-fig-cream transition-all"
                            >
                              <Minus size={11} />
                            </button>
                            <span className="font-fig-body text-sm text-fig-cream w-7 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-7 h-7 flex items-center justify-center text-fig-cream/50 hover:bg-fig-cream/10 hover:text-fig-cream transition-all"
                            >
                              <Plus size={11} />
                            </button>
                          </div>

                          <button
                            onClick={() => removeItem(item.id)}
                            className="ml-auto font-fig-body text-[11px] text-fig-cream/25 hover:text-fig-terracotta transition-colors"
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
              <div className="px-5 py-5 border-t border-fig-cream/10 space-y-3">
                {/* Coupon stub */}
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-dashed border-fig-cream/15 text-fig-cream/30 hover:border-fig-terracotta/40 hover:text-fig-terracotta/70 transition-all cursor-pointer group">
                  <Tag size={13} className="group-hover:text-fig-terracotta/70" />
                  <span className="font-fig-body text-xs">Add coupon code</span>
                </div>

                {/* Total */}
                <div className="flex justify-between items-center py-1">
                  <span className="font-fig-body text-sm text-fig-cream/50">Subtotal</span>
                  <span className="font-fig font-bold text-xl text-fig-cream">₹{total.toLocaleString("en-IN")}</span>
                </div>
                <p className="font-fig-body text-[10px] text-fig-cream/25">Taxes and shipping calculated at checkout.</p>

                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="fig-btn w-full text-center shadow-lg shadow-fig-terracotta/25"
                >
                  Checkout — ₹{total.toLocaleString("en-IN")}
                </Link>
                <Link
                  href="/cart"
                  onClick={closeCart}
                  className="inline-flex items-center justify-center gap-2 w-full text-center text-sm border-2 border-fig-cream/25 text-fig-cream font-fig font-semibold px-6 py-3 rounded-full hover:border-fig-cream/60 transition-colors"
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
