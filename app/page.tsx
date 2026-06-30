import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShieldCheck, RefreshCw, Leaf, Award } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { getFeaturedProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Fluno — Care in Every Drop",
  description:
    "Mid-premium personal care and hygiene products from Hyderabad. Clean ingredients, dermatologist-tested, repeat-worthy.",
};

const whyUs = [
  {
    icon: ShieldCheck,
    title: "EU-Standard Safety",
    body: "UV filters and ingredients vetted against EU/UK safety standards — the most stringent in the world.",
  },
  {
    icon: Leaf,
    title: "Clean Formulas",
    body: "No unnecessary harsh chemicals. Every ingredient earns its place in the formula.",
  },
  {
    icon: RefreshCw,
    title: "50%+ Repeat Rate",
    body: "More than half our customers come back. Products that actually deliver on their promises.",
  },
  {
    icon: Award,
    title: "4.5 / 5 Rating",
    body: "Over 1,000 units sold. Zero paid marketing. 100% organic growth and honest reviews.",
  },
];

const testimonials = [
  {
    name: "Ashwini",
    text: "I switched to Fluno hand wash two months ago and my hands actually feel soft now. I was skeptical at first but the difference is real.",
    rating: 5,
  },
  {
    name: "Srikar",
    text: "The sunscreen doesn't leave any white cast — that's rare in this price range. I've already recommended it to my whole family.",
    rating: 5,
  },
  {
    name: "Manish",
    text: "Quality you can feel the moment you use it. These guys clearly know what they're doing with ingredients.",
    rating: 4,
  },
];

export default function HomePage() {
  const featured = getFeaturedProducts();

  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-fluno-bg">
        <div className="absolute inset-0 bg-gradient-to-br from-fluno-teal/5 via-transparent to-fluno-blush/10 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              {/* Eyebrow */}
              <p className="font-mono text-xs tracking-widest text-fluno-teal uppercase mb-6">
                Hyderabad · India · D2C Personal Care
              </p>

              {/* Headline */}
              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-fluno-ink leading-[1.05] tracking-tight">
                Personal care
                <br />
                <em className="not-italic text-fluno-teal">formulated</em>
                <br />
                with intention.
              </h1>

              <p className="font-body text-lg text-fluno-ink/60 mt-6 max-w-md leading-relaxed">
                Clean ingredients. Honest pricing. Products you'll reach for
                every single day.
              </p>

              {/* CTA */}
              <div className="flex flex-wrap gap-4 mt-10">
                <Link href="/shop" className="btn-primary text-base px-8 py-3.5">
                  Shop Now
                  <ArrowRight size={16} />
                </Link>
                <Link href="/about" className="btn-outline text-base px-8 py-3.5">
                  Our Story
                </Link>
              </div>

              {/* Social proof strip */}
              <div className="flex flex-wrap gap-6 mt-10 pt-10 border-t border-fluno-stone/40">
                {[
                  ["1,000+", "Units Sold"],
                  ["50%+", "Repeat Rate"],
                  ["4.5/5", "Avg. Rating"],
                ].map(([val, label]) => (
                  <div key={label}>
                    <p className="font-display text-2xl text-fluno-teal font-semibold">
                      {val}
                    </p>
                    <p className="font-mono text-xs text-fluno-ink/40 mt-0.5">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative hidden lg:block">
              <div className="aspect-[4/5] rounded-sm overflow-hidden bg-fluno-stone/20">
                <Image
                  src="https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80"
                  alt="Fluno personal care products"
                  fill
                  priority
                  className="object-cover"
                />
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-6 -left-6 bg-white border border-fluno-stone/40 rounded-sm px-5 py-4 shadow-lg">
                <p className="font-mono text-xs text-fluno-teal uppercase tracking-wider">
                  Ingredient Safety
                </p>
                <p className="font-display text-base text-fluno-ink mt-1">
                  EU/UK Standard
                </p>
                <p className="font-mono text-xs text-fluno-ink/40 mt-0.5">
                  SPF 50+ PA++++
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TAGLINE STRIP */}
      <div className="bg-fluno-teal py-4 overflow-hidden">
        <div className="flex gap-12 animate-[marquee_20s_linear_infinite] whitespace-nowrap">
          {Array(6)
            .fill("Care in Every Drop.")
            .map((t, i) => (
              <span
                key={i}
                className="font-display text-white/90 text-lg italic shrink-0"
              >
                {t}
              </span>
            ))}
        </div>
      </div>

      {/* FEATURED PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="section-title">Our Products</h2>
            <p className="section-sub">
              Every formula earns your trust before it earns your repeat order.
            </p>
          </div>
          <Link
            href="/shop"
            className="hidden sm:flex items-center gap-2 text-sm text-fluno-teal hover:underline font-body"
          >
            View All <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/shop" className="btn-outline">
            View All Products
          </Link>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="section-title">Why Fluno?</h2>
            <p className="section-sub max-w-xl mx-auto">
              We measure success differently — not by ad spend, but by whether
              you come back for a second bottle.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyUs.map((w) => (
              <div key={w.title} className="text-center">
                <div className="w-12 h-12 bg-fluno-teal/10 rounded-sm flex items-center justify-center mx-auto mb-4">
                  <w.icon size={22} className="text-fluno-teal" />
                </div>
                <h3 className="font-display text-lg text-fluno-ink mb-2">
                  {w.title}
                </h3>
                <p className="font-body text-sm text-fluno-ink/60 leading-relaxed">
                  {w.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BRAND STORY STRIP */}
      <section className="relative py-20 bg-fluno-ink text-white overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,#1E5C56,transparent_60%)]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="font-mono text-xs tracking-widest text-fluno-blush uppercase mb-4">
              Our Story
            </p>
            <h2 className="font-display text-4xl text-white leading-tight">
              Built on a simple belief: you shouldn&apos;t have to choose
              between safe and effective.
            </h2>
            <p className="font-body text-white/60 mt-5 leading-relaxed">
              Founded by Avinash Mohan V and Dr. Sai Prasad MBBS, Fluno was
              born in Hyderabad with one question: why do most personal care
              products either cut corners on ingredients or charge luxury
              prices? We formulated our way to the answer — and we&apos;re just
              getting started.
            </p>
            <Link href="/about" className="btn-outline mt-8 border-white/30 text-white hover:bg-white hover:text-fluno-ink">
              Read Our Story
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 bg-fluno-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">What Our Customers Say</h2>
            <p className="section-sub">Real reviews. No filters.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="card p-6 bg-white"
              >
                <div className="flex mb-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <svg
                      key={s}
                      className={`w-4 h-4 ${
                        s <= t.rating
                          ? "text-amber-400 fill-amber-400"
                          : "text-fluno-stone"
                      }`}
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="font-body text-fluno-ink/70 leading-relaxed italic">
                  &ldquo;{t.text}&rdquo;
                </p>
                <p className="font-display text-fluno-teal mt-4 font-medium">
                  — {t.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="bg-fluno-blush/30 py-16 border-y border-fluno-blush/30">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-display text-4xl text-fluno-ink">
            Ready to make the switch?
          </h2>
          <p className="font-body text-fluno-ink/60 mt-3 text-lg">
            Join 1,000+ customers who chose quality over compromise.
          </p>
          <Link href="/shop" className="btn-primary mt-8 text-base px-10 py-4">
            Shop Now <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
