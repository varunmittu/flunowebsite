"use client";

import Link from "next/link";
import { Instagram, Facebook, Youtube, ArrowRight, Mail, MapPin, ExternalLink } from "lucide-react";
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
        toast.success("You're subscribed!", { description: "Welcome to the Fluno family.", icon: "💜" });
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
    <footer style={{ background: "linear-gradient(175deg, #09060F 0%, #0D0618 50%, #070310 100%)" }}>

      {/* ── Newsletter band ── */}
      <div className="border-b border-white/8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left max-w-md">
              <p className="font-mono text-xs text-fluno-purple/60 tracking-widest uppercase mb-3">Newsletter</p>
              <p className="font-brand font-bold text-2xl text-white leading-snug">
                Skincare tips. New launches. No noise.
              </p>
              <p className="font-body text-sm text-white/35 mt-2">
                Join 2,000+ subscribers who get early access and honest advice.
              </p>
            </div>

            {done ? (
              <div className="flex items-center gap-3 px-6 py-4 rounded-2xl border border-fluno-purple/25 bg-fluno-purple/8">
                <span className="text-2xl">💜</span>
                <p className="font-display font-semibold text-fluno-purple">You&apos;re on the list!</p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2 w-full max-w-sm">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="input-dark flex-1"
                  required
                />
                <button type="submit" disabled={loading} className="btn-primary flex-shrink-0">
                  {loading ? "…" : <><ArrowRight size={15} /></>}
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
            <Link href="/" className="inline-block mb-5 group">
              <span className="font-brand font-bold text-4xl text-white text-glow group-hover:text-fluno-purple transition-colors duration-200">
                fluno
              </span>
              <p className="font-mono text-[9px] text-fluno-purple/50 tracking-[0.2em] uppercase mt-0.5">
                care in every drop
              </p>
            </Link>

            <p className="font-body text-sm text-white/35 leading-relaxed max-w-xs mb-6">
              Mid-premium personal care formulated with intention. Made in India.
              EU-standard ingredients. Honest pricing. Real results.
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
                  className="w-9 h-9 rounded-xl border border-white/10 flex items-center justify-center text-white/35 hover:text-fluno-purple hover:border-fluno-purple/30 hover:bg-fluno-purple/10 transition-all duration-200"
                >
                  <Icon size={15} />
                </a>
              ))}
              <a
                href="https://threads.net/@myfluno"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Threads"
                className="w-9 h-9 rounded-xl border border-white/10 flex items-center justify-center text-white/35 font-mono font-bold text-sm hover:text-fluno-purple hover:border-fluno-purple/30 hover:bg-fluno-purple/10 transition-all duration-200"
              >
                @
              </a>
            </div>

            <div className="space-y-2">
              <a href="mailto:contact@myfluno.com" className="flex items-center gap-2 text-xs text-white/30 hover:text-fluno-purple transition-colors">
                <Mail size={12} /> contact@myfluno.com
              </a>
              <div className="flex items-center gap-2 text-xs text-white/30">
                <MapPin size={12} /> India
              </div>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="eyebrow text-white/25 mb-5 text-[10px]">Shop</h4>
            <ul className="space-y-3">
              {shop.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="font-body text-sm text-white/45 hover:text-fluno-purple transition-colors duration-150">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="eyebrow text-white/25 mb-5 text-[10px]">Company</h4>
            <ul className="space-y-3">
              {company.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    target={(l as { external?: boolean }).external ? "_blank" : undefined}
                    rel={(l as { external?: boolean }).external ? "noopener noreferrer" : undefined}
                    className="font-body text-sm text-white/45 hover:text-fluno-purple transition-colors duration-150 inline-flex items-center gap-1"
                  >
                    {l.label}
                    {(l as { external?: boolean }).external && <ExternalLink size={10} className="text-white/20" />}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="eyebrow text-white/25 mb-5 text-[10px]">Legal</h4>
            <ul className="space-y-3">
              {legal.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="font-body text-sm text-white/45 hover:text-fluno-purple transition-colors duration-150">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-6 border-t border-white/8 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="font-mono text-xs text-white/20">
            © {new Date().getFullYear()} Parvar Enterprise. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
