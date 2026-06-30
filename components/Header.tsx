"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ShoppingBag, Search, User, Menu, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Shop",    href: "/shop"    },
  { label: "Blog",    href: "/blog"    },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const { itemCount, openCart } = useCart();
  const [menuOpen, setMenuOpen]     = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled]     = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-fluno-dark/90 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-fluno-purple/5"
          : "bg-fluno-dark/70 backdrop-blur-sm border-b border-white/5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[68px]">

          {/* Logo */}
          <Link href="/" className="flex flex-col leading-none group">
            <span className="font-brand font-bold text-3xl text-white group-hover:text-fluno-purple transition-colors duration-200 text-glow">
              fluno
            </span>
            <span className="font-mono text-[8px] text-fluno-purple/70 tracking-[0.2em] uppercase -mt-0.5">
              care in every drop
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="font-body text-sm text-white/60 hover:text-fluno-purple transition-colors duration-200 relative group"
              >
                {l.label}
                <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-fluno-purple group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2.5 text-white/50 hover:text-fluno-purple transition-colors rounded-xl hover:bg-fluno-purple/10"
              aria-label="Search"
            >
              <Search size={18} />
            </button>

            <Link
              href="/account"
              className="p-2.5 text-white/50 hover:text-fluno-purple transition-colors rounded-xl hover:bg-fluno-purple/10"
              aria-label="Account"
            >
              <User size={18} />
            </Link>

            <button
              onClick={openCart}
              className="relative p-2.5 text-white/50 hover:text-fluno-purple transition-colors rounded-xl hover:bg-fluno-purple/10"
              aria-label={`Cart, ${itemCount} items`}
            >
              <ShoppingBag size={18} />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-fluno-purple text-white text-[10px] font-bold font-mono w-4.5 h-4.5 min-w-[18px] min-h-[18px] rounded-full flex items-center justify-center leading-none">
                  {itemCount > 9 ? "9+" : itemCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2.5 text-white/50 hover:text-fluno-purple transition-colors rounded-xl hover:bg-fluno-purple/10"
              aria-label="Menu"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Search bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden pb-3"
            >
              <input
                autoFocus
                type="search"
                placeholder="Search products…"
                className="input-dark"
                onKeyDown={(e) => { if (e.key === "Escape") setSearchOpen(false); }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile nav */}
        <AnimatePresence>
          {menuOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden border-t border-white/10 pt-3 pb-4 space-y-1"
            >
              {navLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="block font-body text-sm text-white/60 hover:text-fluno-purple py-2 px-3 rounded-xl hover:bg-fluno-purple/10 transition-all"
                >
                  {l.label}
                </Link>
              ))}
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
