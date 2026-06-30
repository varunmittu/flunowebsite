"use client";

import { X, Plus, Minus, ShoppingBag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, total, itemCount } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-fluno-dark/60 backdrop-blur-sm"
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="fixed right-0 top-0 h-full w-full max-w-sm z-50 bg-fluno-dark border-l border-white/10 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
              <h2 className="font-display text-xl text-white">
                Cart
                {itemCount > 0 && (
                  <span className="ml-2 font-mono text-sm text-fluno-purple">
                    ({itemCount})
                  </span>
                )}
              </h2>
              <button
                onClick={closeCart}
                className="p-2 text-white/40 hover:text-fluno-purple transition-colors rounded-xl hover:bg-fluno-purple/10"
                aria-label="Close cart"
              >
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <div className="w-16 h-16 rounded-full bg-fluno-purple/10 flex items-center justify-center">
                    <ShoppingBag size={28} className="text-fluno-purple/50" />
                  </div>
                  <p className="font-body text-white/40">Your cart is empty.</p>
                  <Link href="/shop" onClick={closeCart} className="btn-primary text-sm">
                    Browse Products
                  </Link>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex gap-4 pb-4 border-b border-white/10 last:border-0"
                  >
                    <div className="w-20 h-20 bg-white/5 rounded-xl overflow-hidden flex-shrink-0 border border-white/10">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-sm font-medium text-white truncate">{item.name}</p>
                      <p className="font-mono text-xs text-white/30 mt-0.5">{item.size}</p>
                      <p className="font-brand font-semibold text-sm text-fluno-purple mt-1">
                        ₹{item.price}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 border border-white/20 rounded-lg flex items-center justify-center text-white/50 hover:border-fluno-purple hover:text-fluno-purple transition-all"
                        >
                          <Minus size={11} />
                        </button>
                        <span className="font-mono text-sm text-white w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 border border-white/20 rounded-lg flex items-center justify-center text-white/50 hover:border-fluno-purple hover:text-fluno-purple transition-all"
                        >
                          <Plus size={11} />
                        </button>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="ml-auto text-xs text-white/25 hover:text-red-400 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-6 py-5 border-t border-white/10 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-body text-sm text-white/50">Subtotal</span>
                  <span className="font-brand font-bold text-xl text-white">
                    ₹{total.toLocaleString("en-IN")}
                  </span>
                </div>
                <p className="text-xs text-white/25">Shipping calculated at checkout.</p>
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
