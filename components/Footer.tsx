"use client";

import Link from "next/link";
import { Instagram, Facebook, Youtube, ArrowRight, Mail, ExternalLink } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const shop = [
  { label: "Hand Wash",         href: "/product/fluno-hand-wash-250ml"  },
  { label: "Sunscreen SPF 50+", href: "/product/fluno-spf50-sunscreen"  },
  { label: "All Products",      href: "/shop"                            },
];

const company = [
  { label: "About Us",     href: "/about"                               },
  { label: "Blog",         href: "/blog"                                },
  { label: "Contact",      href: "/contact"                             },
  { label: "Support",      href: "/support"                             },
  { label: "FAQ",          href: "/faq"                                 },
  { label: "Amazon Store", href: "https://www.amazon.in", external: true },
];

const legal = [
  { label: "Privacy Policy",     href: "/privacy-policy"  },
  { label: "Terms & Conditions", href: "/terms"            },
  { label: "Shipping Policy",    href: "/shipping-policy"  },
  { label: "Refund Policy",      href: "/refund-policy"    },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [done, setDone]   = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setDone(true);
        toast.success("You're subscribed!", { description: "Welcome to Fluno." });
      } else {
        toast.error("Couldn't subscribe. Please try again.");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <footer className="bg-fig-navy text-[#C9CCDC]">

      {/* ── Newsletter band ── */}
      <div className="border-b border-fig-cream/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left max-w-md">
              <p className="font-fig font-semibold text-[11px] text-fig-mustard tracking-[0.16em] uppercase mb-3">Newsletter</p>
              <p className="font-fig font-bold text-2xl text-fig-cream leading-snug">
                Skincare tips. New launches. No noise.
              </p>
              <p className="font-fig-body text-sm text-[#9BA0B8] mt-2">
                Join 2,000+ subscribers who get early access and honest advice.
              </p>
            </div>

            {done ? (
              <div className="flex items-center gap-3 px-6 py-4 rounded-2xl border border-fig-sage/40 bg-fig-sage/10">
                <p className="font-fig font-semibold text-fig-sage">You&apos;re on the list ✓</p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2 w-full max-w-sm">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 border border-fig-cream/20 bg-fig-cream/10 text-fig-cream px-4 py-3 rounded-full font-fig-body text-sm placeholder:text-fig-cream/35 focus:outline-none focus:border-fig-terracotta/70 focus:ring-2 focus:ring-fig-terracotta/25 transition-all"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-shrink-0 inline-flex items-center justify-center rounded-full bg-fig-terracotta hover:bg-fig-terracotta-deep text-fig-navy font-fig font-semibold px-5 py-3 transition-colors disabled:opacity-60"
                  aria-label="Subscribe"
                >
                  {loading ? "…" : <ArrowRight size={15} />}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* ── Main footer ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Brand */}
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-3 mb-5 group">
              <span>
                <span className="font-fig font-bold text-4xl text-fig-cream tracking-tight group-hover:text-fig-terracotta transition-colors duration-200">
                  fluno
                </span>
                <p className="font-fig-body text-[9px] text-fig-cream/45 tracking-[0.2em] uppercase mt-0.5">
                  care in every drop
                </p>
              </span>
            </Link>

            <p className="font-fig-body text-sm text-[#9BA0B8] leading-relaxed max-w-xs mb-6">
              Mid-premium everyday personal care that keeps up with you. A Parvar
              Enterprise brand.
            </p>

            <div className="flex gap-3 mb-6">
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
                  className="w-9 h-9 rounded-xl border border-fig-cream/15 flex items-center justify-center text-fig-cream/50 hover:text-fig-terracotta hover:border-fig-terracotta/40 hover:bg-fig-terracotta/10 transition-all duration-200"
                >
                  <Icon size={15} />
                </a>
              ))}
              <a
                href="https://threads.net/@myfluno"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Threads"
                className="w-9 h-9 rounded-xl border border-fig-cream/15 flex items-center justify-center text-fig-cream/50 font-fig font-bold text-sm hover:text-fig-terracotta hover:border-fig-terracotta/40 hover:bg-fig-terracotta/10 transition-all duration-200"
              >
                @
              </a>
            </div>

            <div className="space-y-2">
              <a href="mailto:contact@myfluno.com" className="flex items-center gap-2 text-xs text-fig-cream/40 hover:text-fig-terracotta transition-colors">
                <Mail size={12} /> contact@myfluno.com
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-fig font-semibold text-[10px] tracking-[0.16em] uppercase text-fig-cream/35 mb-5">Shop</h4>
            <ul className="space-y-3">
              {shop.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="font-fig-body text-sm text-[#9BA0B8] hover:text-fig-cream transition-colors duration-150">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-fig font-semibold text-[10px] tracking-[0.16em] uppercase text-fig-cream/35 mb-5">Company</h4>
            <ul className="space-y-3">
              {company.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    target={(l as { external?: boolean }).external ? "_blank" : undefined}
                    rel={(l as { external?: boolean }).external ? "noopener noreferrer" : undefined}
                    className="font-fig-body text-sm text-[#9BA0B8] hover:text-fig-cream transition-colors duration-150 inline-flex items-center gap-1"
                  >
                    {l.label}
                    {(l as { external?: boolean }).external && <ExternalLink size={10} className="text-fig-cream/25" />}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-fig font-semibold text-[10px] tracking-[0.16em] uppercase text-fig-cream/35 mb-5">Legal</h4>
            <ul className="space-y-3">
              {legal.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="font-fig-body text-sm text-[#9BA0B8] hover:text-fig-cream transition-colors duration-150">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-6 border-t border-fig-cream/10 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="font-fig-body text-xs text-fig-cream/30">
            © {new Date().getFullYear()} Parvar Enterprise. All rights reserved.
          </p>
          <p className="font-fig-body text-xs text-fig-cream/30">
            Made with care
          </p>
        </div>
      </div>
    </footer>
  );
}
