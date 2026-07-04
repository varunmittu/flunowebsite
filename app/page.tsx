import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { connectDB } from "@/lib/mongodb";
import { ProductModel } from "@/lib/models/Product";
import { getFeaturedProducts } from "@/lib/products";
import HomeProductCard from "@/components/fig/HomeProductCard";
import NotifyStrip from "@/components/fig/NotifyStrip";
import AnimateIn from "@/components/AnimateIn";
import {
  DoodleReveal, DoodleCard, WavingFig, WalkingPeople, HappyTeam, ThumbsUp,
  DoodleBottle, DoodleSun, DoodleSparkle, DoodleHeart, DoodleDrop,
  DoodleStar, DoodleSquiggle, DoodleBlob,
} from "@/components/doodles/Doodles";

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
  { title: "Kind, not harsh", body: "Cleans and cares without leaving skin tight or stripped — a finish you'll happily reach for every single day.", Icon: DoodleHeart, tone: "coral" as const },
  { title: "Made to repeat", body: "Formulated to slot into the routine you already have, so the good habit becomes the easy one.", Icon: DoodleDrop, tone: "sky" as const },
  { title: "Honestly priced", body: "Mid-premium quality at an everyday price, because care only works when you can keep it up.", Icon: DoodleStar, tone: "sunny" as const },
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
        <DoodleBlob className="absolute -top-24 -left-24 w-[380px] h-[380px] opacity-25 animate-bob-slow" color="#6FE0B0" />
        <DoodleBlob className="absolute top-40 -right-28 w-[420px] h-[420px] opacity-20 animate-bob" color="#B49BFF" />
        <DoodleSun className="absolute top-10 right-[8%] w-16 h-16 hidden sm:block" />
        <DoodleSparkle className="absolute bottom-16 left-[6%] w-8 h-8 animate-wiggle-slow hidden sm:block" tone="coral" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-16 lg:pt-20 lg:pb-24 flex flex-wrap items-center gap-10">
          <div className="flex-1 basis-[440px] min-w-0">
            <AnimateIn>
              <p className="fig-eyebrow text-fig-terracotta mb-4">Personal care, minus the fuss</p>
              <h1 className="font-fig font-bold text-fig-navy text-[clamp(2.7rem,7vw,4.8rem)] leading-[1.03] tracking-tight [text-wrap:balance]">
                Care that keeps<br className="hidden sm:block" /> up with{" "}
                <span className="relative inline-block">
                  you
                  <DoodleSquiggle className="absolute -bottom-2 left-0 w-full h-3" color="#FF6B5C" />
                </span>
                .
              </h1>
            </AnimateIn>
            <AnimateIn delay={0.12}>
              <p className="font-fig-body text-lg text-fig-ink-soft max-w-[50ch] mt-6 mb-8 leading-relaxed">
                Everyday essentials made to feel good on your skin — thoughtfully
                formulated, honestly priced, and easy to fold into the routine you
                already have.
              </p>
              <div className="flex flex-wrap gap-3.5">
                <Link href="/shop" className="fig-btn text-base px-7 py-3.5 shadow-[4px_4px_0_0_#1E1E24] hover:shadow-[2px_2px_0_0_#1E1E24]">
                  Shop the range <ArrowRight size={16} />
                </Link>
                <Link href="#promise" className="inline-flex items-center gap-2 rounded-full border-[2.5px] border-fig-navy text-fig-navy font-fig font-semibold px-7 py-3.5 hover:bg-fig-mustard transition-colors">
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

          <div className="flex-none basis-[300px] grow-0 mx-auto relative">
            <DoodleReveal>
              <DoodleCard tone="mint" className="p-6 animate-bob-slow">
                <WavingFig className="w-[min(230px,58vw)] h-auto" tone="coral" />
              </DoodleCard>
            </DoodleReveal>
            <DoodleDrop className="absolute -left-6 top-10 w-9 h-12 animate-bob hidden sm:block" tone="sky" />
            <DoodleStar className="absolute -right-3 -top-3 w-9 h-9 animate-wiggle hidden sm:block" tone="sunny" />
          </div>
        </div>
      </section>

      {/* ── WALKING STRIP (paper band, colourful figures pop) ── */}
      <section className="bg-fig-paper border-y-[3px] border-fig-navy py-8 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-center">
          <DoodleReveal className="w-full max-w-2xl">
            <WalkingPeople className="w-full h-auto" />
          </DoodleReveal>
        </div>
      </section>

      {/* ── THE RANGE (paper) ── */}
      <section id="shop" className="bg-fig-paper py-20 lg:py-24 relative overflow-hidden">
        <DoodleSparkle className="absolute top-14 right-[10%] w-7 h-7 animate-wiggle hidden md:block" tone="lilac" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateIn>
            <p className="fig-eyebrow text-fig-terracotta mb-3">The range</p>
            <h2 className="font-fig font-bold text-fig-navy text-[clamp(1.9rem,4vw,2.8rem)] leading-tight [text-wrap:balance]">
              Two essentials today. More, slowly.
            </h2>
            <p className="font-fig-body text-fig-ink-soft text-lg mt-3 max-w-[56ch]">
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
              <article className="bg-fig-sky/25 border-[2.5px] border-fig-navy rounded-3xl overflow-hidden flex flex-col h-full">
                <div className="relative flex items-center justify-center py-8">
                  <DoodleReveal>
                    <DoodleBottle className="w-28 h-auto animate-bob" tone="coral" />
                  </DoodleReveal>
                  <span className="absolute top-4 left-4 font-fig font-semibold text-[11px] tracking-[0.1em] uppercase bg-fig-navy text-fig-cream rounded-full px-3 py-1.5">
                    In the lab
                  </span>
                </div>
                <div className="flex flex-col gap-2 p-6 flex-1 border-t-[2.5px] border-fig-navy">
                  <span className="font-fig font-semibold text-[11px] tracking-[0.12em] uppercase text-fig-terracotta">Next up</span>
                  <h3 className="font-fig font-bold text-xl text-fig-navy leading-tight">The third essential</h3>
                  <p className="font-fig-body text-sm text-fig-ink-soft">
                    In formulation now. It ships when it clears the bar — join the list and you&apos;ll hear first.
                  </p>
                  <a href="#notify" className="mt-auto pt-4 inline-flex items-center gap-1.5 font-fig font-semibold text-fig-terracotta hover:gap-2.5 transition-all">
                    Get notified <ArrowRight size={15} />
                  </a>
                </div>
              </article>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* ── THREE RULES (coral) ── */}
      <section className="bg-fig-terracotta border-y-[3px] border-fig-navy py-20 lg:py-24 relative overflow-hidden">
        <DoodleSun className="absolute -top-8 -left-8 w-28 h-28 opacity-90" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
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
                <div className="bg-fig-paper border-[2.5px] border-fig-navy rounded-3xl p-7 h-full shadow-[5px_5px_0_0_#1E1E24]">
                  <DoodleReveal className="mb-4">
                    <r.Icon className="w-14 h-14 animate-wiggle-slow" tone={r.tone} />
                  </DoodleReveal>
                  <h3 className="font-fig font-bold text-xl text-fig-navy">{r.title}</h3>
                  <p className="font-fig-body text-sm text-fig-ink-soft leading-relaxed mt-2.5">{r.body}</p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── UNITED HAPPY TEAM / PROMISE (lilac) ── */}
      <section id="promise" className="bg-fig-lilac border-b-[3px] border-fig-navy py-20 lg:py-24 relative overflow-hidden">
        <DoodleSparkle className="absolute top-16 left-[8%] w-8 h-8 animate-wiggle hidden md:block" tone="sunny" />
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
              <ul className="mt-7 grid gap-3.5 max-w-[46ch]">
                {promises.map((s) => (
                  <li key={s} className="flex gap-3 items-center text-fig-navy">
                    <span className="flex-none w-7 h-7 rounded-full bg-fig-paper border-[2.5px] border-fig-navy flex items-center justify-center text-[13px] font-bold">✓</span>
                    <span className="font-fig-body text-[15px]">{s}</span>
                  </li>
                ))}
              </ul>
            </AnimateIn>
          </div>
          <div className="flex-none basis-[320px] grow-0 mx-auto">
            <DoodleReveal>
              <DoodleCard tone="paper" className="p-5">
                <HappyTeam className="w-[min(300px,74vw)] h-auto" />
              </DoodleCard>
            </DoodleReveal>
          </div>
        </div>
      </section>

      {/* ── REVIEWS NUDGE (sunny) ── */}
      <section className="bg-fig-mustard border-b-[3px] border-fig-navy py-16 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-8">
          <AnimateIn>
            <h2 className="font-fig font-bold text-fig-navy text-[clamp(1.6rem,3.4vw,2.3rem)] leading-tight max-w-[22ch]">
              Loved by people who actually re-buy.
            </h2>
            <p className="font-fig-body text-fig-navy/80 mt-2 max-w-[46ch]">
              Real reviews on every product page — the good, and the honest notes too.
            </p>
          </AnimateIn>
          <DoodleReveal className="mx-auto">
            <DoodleCard tone="paper" className="p-5 animate-bob">
              <ThumbsUp className="w-24 h-auto" tone="sunny" />
            </DoodleCard>
          </DoodleReveal>
        </div>
      </section>

      {/* ── LAUNCH LIST ── */}
      <NotifyStrip />
    </>
  );
}
