"use client";

import Link from "next/link";
import { useState } from "react";
import { ShoppingBag, Search, User, Menu, X } from "lucide-react";
import { useCart } from "@/context/CartContext";

const navLinks = [
  { label: "Shop", href: "/shop" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const { itemCount, openCart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-fluno-bg/95 backdrop-blur-sm border-b border-fluno-stone/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex flex-col leading-none group">
            <span className="font-display text-2xl font-semibold text-fluno-teal tracking-tight group-hover:text-fluno-teal-light transition-colors">
              fluno
            </span>
            <span className="font-mono text-[9px] text-fluno-blush tracking-widest uppercase">
              care in every drop
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="font-body text-sm text-fluno-ink/70 hover:text-fluno-teal transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-fluno-ink/60 hover:text-fluno-teal transition-colors"
              aria-label="Search"
            >
              <Search size={18} />
            </button>

            <Link
              href="/account"
              className="p-2 text-fluno-ink/60 hover:text-fluno-teal transition-colors"
              aria-label="Account"
            >
              <User size={18} />
            </Link>

            <button
              onClick={openCart}
              className="relative p-2 text-fluno-ink/60 hover:text-fluno-teal transition-colors"
              aria-label={`Cart, ${itemCount} items`}
            >
              <ShoppingBag size={18} />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-fluno-teal text-white text-[10px] font-mono font-medium w-4 h-4 rounded-full flex items-center justify-center">
                  {itemCount > 9 ? "9+" : itemCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 text-fluno-ink/60 hover:text-fluno-teal transition-colors"
              aria-label="Menu"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div className="pb-3">
            <input
              autoFocus
              type="search"
              placeholder="Search products…"
              className="input"
              onKeyDown={(e) => {
                if (e.key === "Escape") setSearchOpen(false);
              }}
            />
          </div>
        )}

        {/* Mobile Nav */}
        {menuOpen && (
          <nav className="md:hidden pb-4 border-t border-fluno-stone/40 pt-4 space-y-1">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="block font-body text-sm text-fluno-ink/70 hover:text-fluno-teal py-2 px-2 rounded-sm hover:bg-fluno-stone/30 transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
