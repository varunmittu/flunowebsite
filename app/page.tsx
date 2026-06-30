import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ShieldCheck, RefreshCw, Leaf, Award, Sparkles } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import HeroSection from "@/components/HeroSection";
import AnimateIn from "@/components/AnimateIn";
import { getFeaturedProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Fluno — Care in Every Drop",
  description:
    "Mid-premium personal care and hygiene from Hyderabad. Clean ingredients, dermatologist-tested, repeat-worthy.",
};

const whyUs = [
  { icon: ShieldCheck, title: "EU-Standard Safety",  body: "UV filters and ingredients vetted against EU/UK safety standards — the most stringent in the world." },
  { icon: Leaf,        title: "Clean Formulas",      body: "No unnecessary harsh chemicals. Every ingredient earns its place in the formula." },
  { icon: RefreshCw,   title: "50%+ Repeat Rate",    body: "More than half our customers come back. Products that actually deliver on their promises." },
  { icon: Award,       title: "4.5 / 5 Rating",      body: "Over 1,000 units sold. Zero paid marketing. 100% organic growth and honest reviews." },
];

const testimonials = [
  { name: "Ashwini", text: "I switched to Fluno hand wash two months ago and my hands actually feel soft now. I was skeptical at first but the difference is real.", rating: 5 },
  { name: "Srikar",  text: "The sunscreen doesn't leave any white cast — that's rare in this price range. I've already recommended it to my whole family.", rating: 5 },
  { name: "Manish",  text: "Quality you can feel the moment you use it. These guys clearly know what they're doing with ingredients.", rating: 4 },
];

export default function HomePage() {
  const featured = getFeaturedProducts();

  return (
    <>
      {/* ── HERO ── */}
      <HeroSection />

      {/* ── MARQUEE STRIP ── */}
      <div className="bg-gradient-to-r from-fluno-purple-deep via-fluno-purple to-fluno-purple-dark py-4 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap gap-0">
          {Array(8).fill(null).map((_, i) => (
            <span key={i} className="font-brand font-semibold text-white/90 text-lg italic shrink-0 px-8">
              Care in Every Drop ✦
            </span>
          ))}
        </div>
      </div>

      {/* ── FEATURED PRODUCTS ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <AnimateIn className="flex items-end justify-between mb-12">
          <div>
            <p className="eyebrow text-fluno-purple mb-3 flex items-center gap-2">
              <Sparkles size={13} /> The Collection
            </p>
            <h2 className="section-title">Our Products</h2>
            <p className="section-sub">Every formula earns your trust before it earns your repeat order.</p>
          </div>
          <Link
            href="/shop"
            className="hidden sm:flex items-center gap-2 text-sm font-semibold text-fluno-purple hover:gap-3 transition-all group"
          >
            View All <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </AnimateIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featured.map((p, i) => (
            <AnimateIn key={p.id} delay={i * 0.1}>
              <ProductCard product={p} />
            </AnimateIn>
          ))}
        </div>

        <AnimateIn className="text-center mt-12">
          <Link href="/shop" className="btn-outline">
            View All Products <ArrowRight size={15} />
          </Link>
        </AnimateIn>
      </section>

      {/* ── WHY FLUNO ── */}
      <section className="bg-fluno-dark py-24 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-fluno-purple/8 blur-[120px]" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateIn className="text-center mb-16">
            <p className="eyebrow text-fluno-purple mb-3 flex items-center justify-center gap-2">
              <Sparkles size={13} /> Why Choose Us
            </p>
            <h2 className="section-title-white">Why Fluno?</h2>
            <p className="section-sub-white max-w-xl mx-auto">
              We measure success differently — not by ad spend, but by whether you come back for a second bottle.
            </p>
          </AnimateIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyUs.map((w, i) => (
              <AnimateIn key={w.title} delay={i * 0.1}>
                <div className="card-dark p-8 text-center h-full">
                  <div className="w-14 h-14 bg-fluno-purple/15 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-fluno-purple/20">
                    <w.icon size={24} className="text-fluno-purple" />
                  </div>
                  <h3 className="font-display text-lg text-white mb-3">{w.title}</h3>
                  <p className="font-body text-sm text-white/45 leading-relaxed">{w.body}</p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── BRAND PROMISE ── */}
      <section className="relative py-24 overflow-hidden bg-fluno-light">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-fluno-purple/5 rounded-full blur-[80px]" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-fluno-purple/8 rounded-full blur-[60px]" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimateIn>
            <p className="eyebrow text-fluno-purple mb-6 flex items-center justify-center gap-2">
              <Sparkles size={13} /> Our Promise
            </p>
            <blockquote className="font-brand font-bold text-4xl md:text-5xl lg:text-6xl text-fluno-ink leading-tight">
              &ldquo;You shouldn&apos;t have to{" "}
              <span className="text-fluno-purple">choose between</span> safe and effective.&rdquo;
            </blockquote>
            <p className="font-body text-lg text-fluno-muted mt-8 leading-relaxed max-w-2xl mx-auto">
              Fluno was born in Hyderabad with one question: why do most personal care products
              either cut corners on ingredients or charge luxury prices?
              We formulated our way to the answer.
            </p>
          </AnimateIn>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateIn className="text-center mb-14">
            <p className="eyebrow text-fluno-purple mb-3 flex items-center justify-center gap-2">
              <Sparkles size={13} /> Customer Love
            </p>
            <h2 className="section-title">What Our Customers Say</h2>
            <p className="section-sub">Real reviews. No filters.</p>
          </AnimateIn>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <AnimateIn key={t.name} delay={i * 0.12}>
                <div className="card p-7 h-full flex flex-col relative overflow-hidden group">
                  {/* Subtle glow on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-fluno-purple/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="flex mb-5">
                    {[1,2,3,4,5].map((s) => (
                      <svg
                        key={s}
                        className={`w-4 h-4 ${s <= t.rating ? "fill-fluno-purple text-fluno-purple" : "fill-fluno-lavender text-fluno-lavender"}`}
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>

                  <p className="font-body text-fluno-ink/70 leading-relaxed italic flex-1 relative z-10">
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <p className="font-brand font-semibold text-fluno-purple mt-5 relative z-10">
                    — {t.name}
                  </p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="relative py-24 overflow-hidden bg-fluno-dark">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-fluno-purple/20 via-fluno-dark to-fluno-purple-deep/10" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-fluno-purple/10 blur-[100px] rounded-full" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
          <AnimateIn>
            <p className="eyebrow text-fluno-purple mb-4 flex items-center justify-center gap-2">
              <Sparkles size={13} /> Join the Fluno family
            </p>
            <h2 className="section-title-white text-5xl md:text-6xl">
              Ready to make the switch?
            </h2>
            <p className="section-sub-white text-lg mt-4">
              Join 1,000+ customers who chose quality over compromise.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 mt-10">
              <Link href="/shop" className="btn-primary text-base px-10 py-4">
                Shop Now <ArrowRight size={16} />
              </Link>
              <Link href="/contact" className="btn-outline-white text-base px-10 py-4">
                Get in Touch
              </Link>
            </div>
          </AnimateIn>
        </div>
      </section>
    </>
  );
}
