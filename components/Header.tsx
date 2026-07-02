"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ShoppingBag, Search, User, Menu, X, ChevronDown, Sparkles } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

const navLinks = [
  { label: "Shop",     href: "/shop"     },
  { label: "Blog",     href: "/blog"     },
  { label: "About",    href: "/about"    },
  { label: "Contact",  href: "/contact"  },
  { label: "Wishlist", href: "/wishlist" },
];

export default function Header() {
  const { itemCount, openCart } = useCart();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen]     = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled]     = useState(false);
  const [announcementHidden, setAnnouncementHidden] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false); setSearchOpen(false); }, [pathname]);

  return (
    <>
      {/* ── Announcement bar ── */}
      <AnimatePresence>
        {!announcementHidden && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden bg-gradient-to-r from-fluno-purple-deep via-fluno-purple to-fluno-purple-dark"
          >
            <div className="flex items-center justify-center gap-3 py-2 px-4 relative">
              <Sparkles size={11} className="text-white/70 flex-shrink-0" />
              <p className="font-mono text-[11px] text-white/90 text-center">
                Free shipping on orders above ₹599 · Dermatologist-tested formulas
              </p>
              <button
                onClick={() => setAnnouncementHidden(true)}
                className="absolute right-3 text-white/50 hover:text-white"
                aria-label="Dismiss"
              >
                <X size={13} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main header ── */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-fluno-dark/92 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-fluno-dark/50"
            : "bg-fluno-dark/75 backdrop-blur-md border-b border-white/5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[66px]">

            {/* Logo */}
            <Link href="/" className="flex flex-col leading-none group flex-shrink-0">
              <span className="font-brand font-bold text-[2rem] text-white group-hover:text-fluno-purple transition-colors duration-200 text-glow leading-none">
                fluno
              </span>
              <span className="font-mono text-[7px] text-fluno-purple/60 tracking-[0.22em] uppercase">
                care in every drop
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((l) => {
                const active = pathname === l.href || pathname.startsWith(l.href + "/");
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={`relative font-body text-sm px-4 py-2 rounded-lg transition-all duration-200 group ${
                      active
                        ? "text-fluno-purple bg-fluno-purple/10"
                        : "text-white/55 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {l.label}
                    {active && (
                      <span className="absolute -bottom-0.5 left-4 right-4 h-px bg-fluno-purple rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-0.5">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className={`p-2.5 transition-all rounded-xl ${
                  searchOpen ? "text-fluno-purple bg-fluno-purple/10" : "text-white/45 hover:text-fluno-purple hover:bg-fluno-purple/10"
                }`}
                aria-label="Search"
              >
                <Search size={17} />
              </button>

              {/* Account */}
              <Link
                href="/account"
                className="p-2.5 text-white/45 hover:text-fluno-purple hover:bg-fluno-purple/10 transition-all rounded-xl"
                aria-label="Account"
              >
                <User size={17} />
              </Link>

              {/* Cart */}
              <button
                onClick={openCart}
                className="relative p-2.5 text-white/45 hover:text-fluno-purple hover:bg-fluno-purple/10 transition-all rounded-xl ml-0.5"
                aria-label={`Cart, ${itemCount} items`}
              >
                <ShoppingBag size={17} />
                <AnimatePresence>
                  {itemCount > 0 && (
                    <motion.span
                      key="badge"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-0.5 -right-0.5 bg-fluno-purple text-white font-mono text-[9px] font-bold min-w-[17px] h-[17px] rounded-full flex items-center justify-center leading-none px-0.5"
                    >
                      {itemCount > 9 ? "9+" : itemCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden p-2.5 text-white/45 hover:text-fluno-purple hover:bg-fluno-purple/10 transition-all rounded-xl ml-1"
                aria-label="Menu"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {menuOpen
                    ? <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}><X size={19} /></motion.span>
                    : <motion.span key="m" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}><Menu size={19} /></motion.span>
                  }
                </AnimatePresence>
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
                transition={{ duration: 0.2 }}
                className="overflow-hidden pb-3"
              >
                <input
                  autoFocus
                  type="search"
                  placeholder="Search products, ingredients…"
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
                transition={{ duration: 0.22 }}
                className="md:hidden overflow-hidden border-t border-white/10 pt-3 pb-4 space-y-0.5"
              >
                {navLinks.map((l, i) => {
                  const active = pathname === l.href;
                  return (
                    <motion.div
                      key={l.href}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link
                        href={l.href}
                        className={`flex items-center font-body text-sm py-2.5 px-3 rounded-xl transition-all ${
                          active
                            ? "text-fluno-purple bg-fluno-purple/10 font-semibold"
                            : "text-white/60 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        {l.label}
                        {active && <ChevronDown size={12} className="ml-auto rotate-[-90deg]" />}
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.nav>
            )}
          </AnimatePresence>
        </div>
      </header>
    </>
  );
}
