import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Leaf, Sparkles, Zap, Clock } from "lucide-react";
import HeroSection from "@/components/HeroSection";
import AnimateIn from "@/components/AnimateIn";
import ProductCarousel from "@/components/ProductCarousel";
import TestimonialCarousel from "@/components/TestimonialCarousel";
import NewsletterForm from "@/components/NewsletterForm";
import { connectDB } from "@/lib/mongodb";
import { ProductModel } from "@/lib/models/Product";
import { getFeaturedProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Fluno — Care in Every Drop",
  description: "Mid-premium personal care and hygiene from India. Clean ingredients, dermatologist-tested, repeat-worthy.",
};

const whyUs = [
  { icon: Leaf,        title: "Clean Formulas",      body: "No unnecessary harsh chemicals. Every ingredient earns its place in the formula.", color: "from-emerald-500/20 to-teal-500/10" },
  { icon: ShieldCheck, title: "Dermatologist Tested", body: "Formulated with dermatologist input and tested on diverse Indian skin types.", color: "from-violet-500/20 to-purple-500/10" },
];

const ingredients = [
  { name: "Zinc Oxide", role: "Broad-spectrum UV filter", note: "EU approved" },
  { name: "Niacinamide", role: "Brightening + barrier repair", note: "4% concentration" },
  { name: "Hyaluronic Acid", role: "Deep hydration", note: "Multi-molecular weight" },
  { name: "Allantoin", role: "Skin conditioning", note: "Dermatologist favourite" },
];

const process = [
  { step: "01", title: "Research",     body: "Every formula begins with clinical literature and dermatologist input — not trends.", icon: Zap },
  { step: "02", title: "Formulation",  body: "Ingredients are selected against EU/UK safety standards before any testing begins.", icon: Leaf },
  { step: "03", title: "Testing",      body: "Real-world trials with diverse Indian skin types across climates and seasons.", icon: ShieldCheck },
  { step: "04", title: "Your Skin",    body: "Only when we're confident the product works consistently does it go on sale.", icon: Clock },
];

interface RawProduct {
  _id: unknown; slug: string; name: string; tagline?: string; price: number;
  originalPrice?: number; size?: string; category?: string; rating?: number;
  reviewCount?: number; images?: string[]; description?: string;
  ingredients?: string[]; howToUse?: string[]; benefits?: string[];
  badges?: string[]; inStock?: boolean; featured?: boolean;
}

export default async function HomePage() {
  let featured: ReturnType<typeof getFeaturedProducts> = [];

  try {
    await connectDB();
    const docs = await ProductModel.find({ active: true, featured: true }).limit(6).lean() as RawProduct[];
    if (docs.length) {
      featured = docs.map((p) => ({
        id: p._id?.toString() ?? p.slug,
        slug: p.slug, name: p.name, tagline: p.tagline ?? "",
        price: p.price, originalPrice: p.originalPrice, size: p.size ?? "",
        category: p.category ?? "", rating: p.rating ?? 0, reviewCount: p.reviewCount ?? 0,
        images: p.images ?? [], description: p.description ?? "",
        ingredients: p.ingredients ?? [], howToUse: p.howToUse ?? [],
        benefits: p.benefits ?? [], badges: p.badges ?? [],
        inStock: p.inStock ?? true, featured: p.featured ?? false,
      }));
    }
  } catch {
    // fallback to static
  }

  if (!featured.length) featured = getFeaturedProducts();

  return (
    <>
      {/* ── HERO ── */}
      <HeroSection />

      {/* ── MARQUEE STRIP ── */}
      <div className="bg-gradient-to-r from-fluno-purple-deep via-fluno-purple to-fluno-purple-dark py-3.5 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap gap-0 select-none">
          {Array(10).fill(null).map((_, i) => (
            <span key={i} className="font-brand font-bold text-white/90 text-base italic shrink-0 px-7">
              Care in Every Drop ✦
            </span>
          ))}
        </div>
      </div>

      {/* ── FEATURED PRODUCTS (Embla carousel) ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <AnimateIn className="flex items-end justify-between mb-16">
          <div>
            <p className="eyebrow text-fluno-purple mb-3 flex items-center gap-2">
              <Sparkles size={12} /> The Collection
            </p>
            <h2 className="section-title">Our Products</h2>
            <p className="section-sub max-w-md">
              Every formula earns your trust before it earns your repeat order.
            </p>
          </div>
          <Link
            href="/shop"
            className="hidden sm:flex items-center gap-2 text-sm font-semibold text-fluno-purple hover:gap-3 transition-all group shrink-0"
          >
            View All <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </AnimateIn>

        <AnimateIn>
          <ProductCarousel products={featured} />
        </AnimateIn>

        <AnimateIn className="text-center mt-12 sm:hidden">
          <Link href="/shop" className="btn-outline">
            View All Products <ArrowRight size={15} />
          </Link>
        </AnimateIn>
      </section>

      {/* ── WHY FLUNO ── */}
      <section className="bg-fluno-dark py-28 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-fluno-purple/6 blur-[140px]" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-fluno-purple-deep/10 blur-[100px] rounded-full" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateIn className="text-center mb-16">
            <p className="eyebrow text-fluno-purple mb-3 flex items-center justify-center gap-2">
              <Sparkles size={12} /> Why Choose Us
            </p>
            <h2 className="section-title-white">Why Fluno?</h2>
            <p className="section-sub-white max-w-lg mx-auto">
              We measure success by whether you come back for a second bottle.
            </p>
          </AnimateIn>

          <div className="grid sm:grid-cols-2 gap-5">
            {whyUs.map((w, i) => (
              <AnimateIn key={w.title} delay={i * 0.1}>
                <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-8 h-full group hover:border-fluno-purple/30 transition-colors duration-300">
                  <div className={`absolute inset-0 bg-gradient-to-br ${w.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  <div className="relative z-10">
                    <div className="w-12 h-12 bg-white/8 border border-white/10 rounded-2xl flex items-center justify-center mb-5 group-hover:border-fluno-purple/30 transition-colors">
                      <w.icon size={22} className="text-fluno-purple" />
                    </div>
                    <h3 className="font-display text-lg text-white mb-2.5">{w.title}</h3>
                    <p className="font-body text-sm text-white/40 leading-relaxed">{w.body}</p>
                  </div>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── INGREDIENT SPOTLIGHT ── */}
      <section className="py-28 bg-fluno-light relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-fluno-purple/4 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-fluno-purple/5 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <AnimateIn direction="left">
              <p className="eyebrow text-fluno-purple mb-4 flex items-center gap-2">
                <Sparkles size={12} /> What&apos;s Inside
              </p>
              <h2 className="section-title mb-6">Ingredients you can trust</h2>
              <p className="font-body text-fluno-ink/60 leading-relaxed mb-10">
                We publish our ingredient philosophy because we have nothing to hide.
                Every active is present at a concentration that actually works — not just
                enough to claim it on the label.
              </p>

              <div className="space-y-4">
                {ingredients.map((ing, i) => (
                  <AnimateIn key={ing.name} delay={i * 0.08} direction="left">
                    <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-fluno-lavender/60 hover:border-fluno-purple/30 hover:shadow-md hover:shadow-fluno-purple/5 transition-all duration-300 group">
                      <div className="w-10 h-10 bg-fluno-purple/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-fluno-purple/20 transition-colors">
                        <Leaf size={16} className="text-fluno-purple" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-display font-semibold text-sm text-fluno-ink">{ing.name}</p>
                        <p className="font-body text-xs text-fluno-muted/70 mt-0.5">{ing.role}</p>
                      </div>
                      <span className="badge text-[10px] flex-shrink-0">{ing.note}</span>
                    </div>
                  </AnimateIn>
                ))}
              </div>
            </AnimateIn>

            <AnimateIn direction="right">
              <div className="relative">
                <div className="aspect-square rounded-3xl bg-gradient-to-br from-fluno-lavender via-white to-fluno-lavender/50 border border-fluno-lavender/60 flex items-center justify-center overflow-hidden">
                  <div className="text-center p-12">
                    <p className="font-mono text-xs text-fluno-purple/60 tracking-widest uppercase mb-4">Formulated with</p>
                    <p
                      className="font-brand font-bold text-fluno-ink leading-none"
                      style={{ fontSize: "clamp(3rem, 8vw, 5.5rem)" }}
                    >
                      Science
                    </p>
                    <p className="font-mono text-sm text-fluno-muted/50 mt-3">
                      not trends
                    </p>
                    <div className="mt-8 flex flex-wrap gap-2 justify-center">
                      {["EU Approved", "pH Balanced", "Dermatologist Tested", "No Parabens", "No SLS"].map((tag) => (
                        <span key={tag} className="badge text-[10px]">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Floating accent */}
                <div className="absolute -top-4 -right-4 glass px-4 py-3 shadow-lg">
                  <p className="font-mono text-[10px] text-fluno-purple">EU / UK Standard</p>
                  <p className="font-display text-sm text-fluno-ink font-semibold mt-0.5">Safety Verified ✓</p>
                </div>
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* ── OUR PROCESS ── */}
      <section className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateIn className="text-center mb-16">
            <p className="eyebrow text-fluno-purple mb-3 flex items-center justify-center gap-2">
              <Sparkles size={12} /> How We Work
            </p>
            <h2 className="section-title">From lab to your skin</h2>
            <p className="section-sub max-w-lg mx-auto">
              No shortcuts. No compromises. Every product goes through this process before we're satisfied.
            </p>
          </AnimateIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Connector line */}
            <div className="hidden lg:block absolute top-8 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-fluno-lavender to-transparent" />

            {process.map((p, i) => (
              <AnimateIn key={p.step} delay={i * 0.1}>
                <div className="relative text-center">
                  <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-fluno-purple to-fluno-purple-dark flex items-center justify-center shadow-lg shadow-fluno-purple/20 relative z-10">
                    <p.icon size={24} className="text-white" />
                  </div>
                  <span className="font-mono text-xs text-fluno-purple/40 tracking-widest">{p.step}</span>
                  <h3 className="font-display text-lg font-semibold text-fluno-ink mt-1 mb-2">{p.title}</h3>
                  <p className="font-body text-sm text-fluno-muted/70 leading-relaxed">{p.body}</p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── BRAND PROMISE ── */}
      <section className="relative py-28 overflow-hidden bg-fluno-dark">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-fluno-purple/15 via-transparent to-fluno-purple-deep/8" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[400px] bg-fluno-purple/8 blur-[120px] rounded-full" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <AnimateIn>
            <p className="eyebrow text-fluno-purple mb-6 flex items-center justify-center gap-2">
              <Sparkles size={12} /> Our Promise
            </p>
            <blockquote
              className="font-brand font-bold text-white leading-tight"
              style={{ fontSize: "clamp(2rem, 5vw, 4.5rem)" }}
            >
              &ldquo;You shouldn&apos;t have to{" "}
              <span className="text-fluno-purple text-glow">choose between</span>{" "}
              safe and effective.&rdquo;
            </blockquote>
            <p className="font-body text-lg text-white/40 mt-8 leading-relaxed max-w-2xl mx-auto">
              Fluno was born in India with one question: why do most personal care products
              either cut corners on ingredients or charge luxury prices? We formulated our way to the answer.
            </p>
            <Link href="/about" className="btn-outline-white mt-10 inline-flex">
              Read Our Story <ArrowRight size={15} />
            </Link>
          </AnimateIn>
        </div>
      </section>

      {/* ── TESTIMONIALS (Embla) ── */}
      <section className="py-28 bg-fluno-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateIn className="text-center mb-14">
            <p className="eyebrow text-fluno-purple mb-3 flex items-center justify-center gap-2">
              <Sparkles size={12} /> Customer Love
            </p>
            <h2 className="section-title">What our customers say</h2>
            <p className="section-sub">Real reviews. No filters. No paid testimonials.</p>
          </AnimateIn>

          <AnimateIn>
            <TestimonialCarousel />
          </AnimateIn>
        </div>
      </section>

      {/* ── NEWSLETTER ── */}
      <section className="py-20 bg-white border-y border-fluno-lavender/60">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <AnimateIn>
            <p className="eyebrow text-fluno-purple mb-3">Stay in the loop</p>
            <h3 className="font-display text-2xl md:text-3xl text-fluno-ink mb-3">
              Skincare tips straight to your inbox
            </h3>
            <p className="font-body text-sm text-fluno-muted/70 mb-8">
              No spam. Just honest skincare advice, ingredient deep-dives, and early access to new products.
            </p>
            <NewsletterForm />
          </AnimateIn>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="relative py-28 overflow-hidden bg-fluno-dark">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-fluno-purple/20 via-fluno-dark to-fluno-purple-deep/10" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-fluno-purple/10 blur-[100px] rounded-full" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
          <AnimateIn>
            <p className="eyebrow text-fluno-purple mb-4 flex items-center justify-center gap-2">
              <Sparkles size={12} /> Join the Fluno family
            </p>
            <h2
              className="font-brand font-bold text-white leading-tight"
              style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}
            >
              Ready to make the switch?
            </h2>
            <p className="section-sub-white text-lg mt-4 mb-10">
              Trusted by skincare enthusiasts who chose quality over compromise.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/shop" className="btn-primary text-base px-10 py-4 shadow-lg shadow-fluno-purple/30">
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
