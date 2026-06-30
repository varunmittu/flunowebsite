"use client";

import Link from "next/link";
import { Instagram, Facebook, Youtube } from "lucide-react";

const legal = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Shipping Policy", href: "/shipping-policy" },
  { label: "Refund Policy", href: "/refund-policy" },
  { label: "Accessibility", href: "/accessibility" },
];

const shop = [
  { label: "Hand Wash", href: "/product/fluno-hand-wash-250ml" },
  { label: "Sunscreen SPF 50+", href: "/product/fluno-spf50-sunscreen" },
  { label: "All Products", href: "/shop" },
];

const company = [
  { label: "About Us", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
  { label: "Amazon Store", href: "https://www.amazon.in", target: "_blank" },
];

export default function Footer() {
  return (
    <footer className="bg-fluno-ink text-white/80">
      {/* Newsletter Strip */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="font-display text-xl text-white">
              Get early access to new launches.
            </p>
            <p className="text-sm text-white/50 mt-1">
              No spam. Only meaningful updates.
            </p>
          </div>
          <form
            className="flex gap-2 w-full md:w-auto"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="your@email.com"
              className="bg-white/10 border border-white/20 text-white placeholder:text-white/30 px-4 py-2.5 rounded-sm text-sm focus:outline-none focus:border-fluno-blush flex-1 md:w-64"
            />
            <button
              type="submit"
              className="bg-fluno-blush text-fluno-ink font-medium px-5 py-2.5 rounded-sm text-sm hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link href="/" className="block mb-3">
              <span className="font-display text-2xl text-white font-semibold">
                fluno
              </span>
            </Link>
            <p className="text-sm text-white/50 leading-relaxed">
              Mid-premium personal care and hygiene, formulated with care.
              Based in Hyderabad, India.
            </p>
            <div className="flex gap-4 mt-5">
              <a
                href="https://instagram.com/myfluno"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-white/40 hover:text-fluno-blush transition-colors"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="text-white/40 hover:text-fluno-blush transition-colors"
              >
                <Facebook size={18} />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="text-white/40 hover:text-fluno-blush transition-colors"
              >
                <Youtube size={18} />
              </a>
              <a
                href="https://threads.net/@myfluno"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Threads"
                className="text-white/40 hover:text-fluno-blush transition-colors text-sm font-mono font-bold"
              >
                @
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-body text-xs font-semibold uppercase tracking-widest text-white/30 mb-4">
              Shop
            </h4>
            <ul className="space-y-2">
              {shop.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-body text-xs font-semibold uppercase tracking-widest text-white/30 mb-4">
              Company
            </h4>
            <ul className="space-y-2">
              {company.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    target={(l as any).target}
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Legal */}
          <div>
            <h4 className="font-body text-xs font-semibold uppercase tracking-widest text-white/30 mb-4">
              Contact
            </h4>
            <address className="not-italic text-sm text-white/60 space-y-1 mb-5">
              <p>contact@myfluno.com</p>
              <p>Hyderabad, India 500090</p>
            </address>
            <h4 className="font-body text-xs font-semibold uppercase tracking-widest text-white/30 mb-3">
              Legal
            </h4>
            <ul className="space-y-2">
              {legal.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-xs text-white/40 hover:text-white/80 transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="divider mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 border-white/10">
          <p className="text-xs text-white/30">
            © 2025 by Parvar Enterprise. All rights reserved.
          </p>
          <p className="text-xs text-white/20 font-mono">
            Grievance Officer: Avinash Mohan V — contact@myfluno.com
          </p>
        </div>
      </div>
    </footer>
  );
}
