"use client";

import Link from "next/link";
import { Instagram, Facebook, Youtube, ArrowRight } from "lucide-react";
import { useState } from "react";

const shop = [
  { label: "Hand Wash",        href: "/product/fluno-hand-wash-250ml"    },
  { label: "Sunscreen SPF 50+", href: "/product/fluno-spf50-sunscreen"   },
  { label: "All Products",     href: "/shop"                              },
];

const company = [
  { label: "Blog",         href: "/blog"                              },
  { label: "Contact",      href: "/contact"                           },
  { label: "Amazon Store", href: "https://www.amazon.in", external: true },
];

const legal = [
  { label: "Privacy Policy",    href: "/privacy-policy"  },
  { label: "Terms & Conditions",href: "/terms"           },
  { label: "Shipping Policy",   href: "/shipping-policy" },
  { label: "Refund Policy",     href: "/refund-policy"   },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [done, setDone]   = useState(false);

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    try {
      await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch {}
    setDone(true);
  }

  return (
    <footer className="bg-fluno-dark text-white/80">
      {/* Newsletter */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="font-brand font-bold text-2xl text-white">
              Get early access to new launches.
            </p>
            <p className="font-body text-sm text-white/40 mt-1">
              No spam. Only meaningful updates — pinky promise.
            </p>
          </div>
          {done ? (
            <p className="font-brand font-semibold text-fluno-purple text-lg">
              You&rsquo;re on the list! ✦
            </p>
          ) : (
            <form onSubmit={handleSubscribe} className="flex gap-2 w-full md:w-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="input-dark flex-1 md:w-64"
                required
              />
              <button type="submit" className="btn-primary whitespace-nowrap">
                Subscribe <ArrowRight size={14} />
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Main */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <Link href="/" className="block mb-4">
              <span className="font-brand font-bold text-3xl text-white text-glow">
                fluno
              </span>
            </Link>
            <p className="text-sm text-white/40 leading-relaxed mb-5">
              Mid-premium personal care and hygiene,<br />
              formulated with care. Based in Hyderabad, India.
            </p>
            <div className="flex gap-4">
              {[
                { href: "https://instagram.com/myfluno", Icon: Instagram, label: "Instagram" },
                { href: "https://facebook.com",          Icon: Facebook,  label: "Facebook"  },
                { href: "https://youtube.com",           Icon: Youtube,   label: "YouTube"   },
              ].map(({ href, Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center
                             text-white/40 hover:text-fluno-purple hover:border-fluno-purple/40
                             hover:bg-fluno-purple/10 transition-all duration-200"
                >
                  <Icon size={16} />
                </a>
              ))}
              <a
                href="https://threads.net/@myfluno"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Threads"
                className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center
                           text-white/40 text-sm font-mono font-bold
                           hover:text-fluno-purple hover:border-fluno-purple/40
                           hover:bg-fluno-purple/10 transition-all duration-200"
              >
                @
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="eyebrow text-white/30 mb-5">Shop</h4>
            <ul className="space-y-3">
              {shop.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-white/50 hover:text-fluno-purple transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="eyebrow text-white/30 mb-5">Company</h4>
            <ul className="space-y-3">
              {company.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    target={(l as { external?: boolean }).external ? "_blank" : undefined}
                    className="text-sm text-white/50 hover:text-fluno-purple transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + Legal */}
          <div>
            <h4 className="eyebrow text-white/30 mb-5">Contact</h4>
            <address className="not-italic text-sm text-white/50 space-y-1 mb-6">
              <p>contact@myfluno.com</p>
              <p>Hyderabad, India 500090</p>
            </address>
            <h4 className="eyebrow text-white/30 mb-3">Legal</h4>
            <ul className="space-y-2">
              {legal.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-xs text-white/30 hover:text-white/70 transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-white/25">
            © 2025 Parvar Enterprise. All rights reserved.
          </p>
          <p className="text-xs text-white/20 font-mono">
            contact@myfluno.com
          </p>
        </div>
      </div>
    </footer>
  );
}
