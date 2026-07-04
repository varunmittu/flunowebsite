import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Leaf, Droplet, Star } from "lucide-react";
import { connectDB } from "@/lib/mongodb";
import { ProductModel } from "@/lib/models/Product";
import { getFeaturedProducts } from "@/lib/products";
import HomeProductCard from "@/components/fig/HomeProductCard";
import NotifyStrip from "@/components/fig/NotifyStrip";
import AnimateIn from "@/components/AnimateIn";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Fluno — Care that keeps up with you",
  description: "Everyday personal care, thoughtfully formulated and honestly priced.",
};

interface RawProduct {
  _id: unknown; slug: string; name: string; tagline?: string; price: number;
  originalPrice?: number; size?: string; category?: string; rating?: number;
  reviewCount?: number; images?: string[]; description?: string;
  ingredients?: string[]; howToUse?: string[]; benefits?: string[];
  badges?: string[]; inStock?: boolean; featured?: boolean;
}

const rules = [
  { title: "Kind, not harsh", body: "Cleans and cares without leaving skin tight or stripped — a finish you'll happily reach for every single day.", Icon: Leaf, tone: "bg-fig-terracotta" },
  { title: "Made to repeat", body: "Formulated to slot into the routine you already have, so the good habit becomes the easy one.", Icon: Droplet, tone: "bg-fig-sky" },
  { title: "Honestly priced", body: "Mid-premium quality at an everyday price, because care only works when you can keep it up.", Icon: Star, tone: "bg-fig-mustard" },
];

const promises = [
  "Full ingredient list on every pack",
  "Never tested on animals",
  "Priced for daily use",
  "Nothing hidden, ever",
];

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
  } catch { /* fall back to static */ }
  if (!featured.length) featured = getFeaturedProducts();

  return (
    <>
      {/* ── HERO (paper) ── */}
      <section className="relative overflow-hidden bg-fig-paper">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-16 lg:pt-20 lg:pb-24 flex flex-wrap items-center gap-10">
          <div className="flex-1 basis-[440px] min-w-0">
            <AnimateIn>
              <p className="fig-eyebrow text-fig-terracotta mb-4">Personal care, minus the fuss</p>
              <h1 className="font-fig font-bold text-fig-navy text-[clamp(2.7rem,7vw,4.8rem)] leading-[1.03] tracking-tight [text-wrap:balance]">
                Care that keeps up with you.
              </h1>
            </AnimateIn>
            <AnimateIn delay={0.12}>
              <p className="font-fig-body text-lg text-fig-ink-soft max-w-[50ch] mt-6 mb-8 leading-relaxed">
                Everyday essentials made to feel good on your skin — thoughtfully
                formulated, honestly priced, and easy to fold into the routine you
                already have.
              </p>
              <div className="flex flex-wrap gap-3.5">
                <Link href="/shop" className="fig-btn text-base px-7 py-3.5">
                  Shop the range <ArrowRight size={16} />
                </Link>
                <Link href="#promise" className="fig-btn-outline text-base px-7 py-3.5">
                  Our promise
                </Link>
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-2 mt-9">
                {["Cruelty-free", "Full ingredient list", "Kind to skin"].map((t) => (
                  <span key={t} className="flex items-center gap-2 text-[13px] font-fig-body text-fig-navy/70">
                    <i className="w-2.5 h-2.5 rounded-full bg-fig-sage border-2 border-fig-navy inline-block" />
                    {t}
                  </span>
                ))}
              </div>
            </AnimateIn>
          </div>

          <div className="flex-none basis-[320px] grow-0 mx-auto w-full max-w-sm">
            <AnimateIn direction="left">
              <div className="grid grid-cols-2 gap-4">
                <div className="aspect-square rounded-[2rem] bg-fig-terracotta border-[2.5px] border-fig-navy shadow-[5px_5px_0_0_#2C2A27] animate-float" style={{ animationDelay: "0s" }} />
                <div className="aspect-square rounded-[2rem] bg-fig-mustard border-[2.5px] border-fig-navy shadow-[5px_5px_0_0_#2C2A27] animate-float" style={{ animationDelay: "0.7s" }} />
                <div className="aspect-square rounded-[2rem] bg-fig-sky border-[2.5px] border-fig-navy shadow-[5px_5px_0_0_#2C2A27] animate-float" style={{ animationDelay: "1.4s" }} />
                <div className="aspect-square rounded-[2rem] bg-fig-sage border-[2.5px] border-fig-navy shadow-[5px_5px_0_0_#2C2A27] animate-float" style={{ animationDelay: "2.1s" }} />
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* ── THE RANGE (mint) ── */}
      <section id="shop" className="bg-fig-sage border-y-[3px] border-fig-navy py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateIn>
            <p className="fig-eyebrow text-fig-navy/70 mb-3">The range</p>
            <h2 className="font-fig font-bold text-fig-navy text-[clamp(1.9rem,4vw,2.8rem)] leading-tight [text-wrap:balance]">
              Two essentials today. More, slowly.
            </h2>
            <p className="font-fig-body text-fig-navy/75 text-lg mt-3 max-w-[56ch]">
              We add a product only when it clears the same bar as the last one —
              no filler, no fifty-variant walls.
            </p>
          </AnimateIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-11">
            {featured.slice(0, 2).map((p, i) => (
              <AnimateIn key={p.id} delay={i * 0.08}>
                <HomeProductCard product={p} index={i} />
              </AnimateIn>
            ))}
            <AnimateIn delay={0.16}>
              <article className="bg-fig-paper border-[2.5px] border-fig-navy rounded-3xl overflow-hidden flex flex-col h-full shadow-[5px_5px_0_0_#2C2A27]">
                <div className="flex-1 flex flex-col justify-center gap-2 p-7">
                  <span className="font-fig font-semibold text-[11px] tracking-[0.12em] uppercase text-fig-terracotta">Next up</span>
                  <h3 className="font-fig font-bold text-2xl text-fig-navy leading-tight">The third essential</h3>
                  <p className="font-fig-body text-sm text-fig-ink-soft">
                    In formulation now. It ships when it clears the bar — join the list and you&apos;ll hear first.
                  </p>
                  <a href="#notify" className="mt-3 inline-flex items-center gap-1.5 font-fig font-semibold text-fig-terracotta hover:gap-2.5 transition-all">
                    Get notified <ArrowRight size={15} />
                  </a>
                </div>
              </article>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* ── THREE RULES (coral) ── */}
      <section className="bg-fig-terracotta border-b-[3px] border-fig-navy py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateIn>
            <p className="fig-eyebrow text-fig-navy mb-3">Why Fluno</p>
            <h2 className="font-fig font-bold text-fig-navy text-[clamp(1.9rem,4vw,2.8rem)] leading-tight [text-wrap:balance]">
              Every formula follows three rules.
            </h2>
            <p className="font-fig-body text-fig-navy/80 text-lg mt-3 max-w-[54ch]">
              If a product can&apos;t keep all three, it doesn&apos;t ship. Simple as that.
            </p>
          </AnimateIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-11">
            {rules.map((r, i) => (
              <AnimateIn key={r.title} delay={i * 0.08}>
                <div className="bg-fig-paper border-[2.5px] border-fig-navy rounded-3xl p-7 h-full shadow-[5px_5px_0_0_#2C2A27]">
                  <span className={`w-14 h-14 rounded-2xl ${r.tone} border-[2.5px] border-fig-navy flex items-center justify-center mb-4`}>
                    <r.Icon size={24} className="text-fig-navy" />
                  </span>
                  <h3 className="font-fig font-bold text-xl text-fig-navy">{r.title}</h3>
                  <p className="font-fig-body text-sm text-fig-ink-soft leading-relaxed mt-2.5">{r.body}</p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROMISE (lilac) ── */}
      <section id="promise" className="bg-fig-lilac border-b-[3px] border-fig-navy py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center gap-12">
          <div className="flex-1 basis-[420px]">
            <AnimateIn>
              <p className="fig-eyebrow text-fig-navy mb-3">The Fluno promise</p>
              <h2 className="font-fig font-bold text-fig-navy text-[clamp(1.9rem,4vw,2.8rem)] leading-tight [text-wrap:balance]">
                Care, done honestly.
              </h2>
              <p className="font-fig-body text-fig-navy/80 text-lg mt-3 max-w-[52ch]">
                One small team, a few firm commitments, and no fine print. This is
                what sits behind every Fluno product:
              </p>
            </AnimateIn>
          </div>
          <div className="flex-1 basis-[360px]">
            <AnimateIn direction="left">
              <ul className="grid gap-3.5">
                {promises.map((s) => (
                  <li key={s} className="flex gap-3 items-center bg-fig-paper border-[2.5px] border-fig-navy rounded-2xl px-4 py-3 shadow-[3px_3px_0_0_#2C2A27]">
                    <span className="flex-none w-7 h-7 rounded-full bg-fig-sage border-[2.5px] border-fig-navy flex items-center justify-center">
                      <Check size={14} className="text-fig-navy" strokeWidth={3} />
                    </span>
                    <span className="font-fig-body text-[15px] text-fig-navy">{s}</span>
                  </li>
                ))}
              </ul>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* ── REVIEWS NUDGE (sunny) ── */}
      <section className="bg-fig-mustard border-b-[3px] border-fig-navy py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateIn>
            <h2 className="font-fig font-bold text-fig-navy text-[clamp(1.6rem,3.4vw,2.3rem)] leading-tight max-w-[24ch]">
              Loved by people who actually re-buy.
            </h2>
            <p className="font-fig-body text-fig-navy/80 mt-2 max-w-[46ch]">
              Real reviews on every product page — the good, and the honest notes too.
            </p>
          </AnimateIn>
        </div>
      </section>

      {/* ── LAUNCH LIST ── */}
      <NotifyStrip />
    </>
  );
}
