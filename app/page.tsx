import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { connectDB } from "@/lib/mongodb";
import { ProductModel } from "@/lib/models/Product";
import { getFeaturedProducts } from "@/lib/products";
import HomeProductCard from "@/components/fig/HomeProductCard";
import NotifyStrip from "@/components/fig/NotifyStrip";
import AnimateIn from "@/components/AnimateIn";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Fluno — Care that keeps up with you",
  description:
    "Everyday personal care, thoughtfully formulated and honestly priced. Made in Hyderabad, India.",
};

interface RawProduct {
  _id: unknown; slug: string; name: string; tagline?: string; price: number;
  originalPrice?: number; size?: string; category?: string; rating?: number;
  reviewCount?: number; images?: string[]; description?: string;
  ingredients?: string[]; howToUse?: string[]; benefits?: string[];
  badges?: string[]; inStock?: boolean; featured?: boolean;
}

const promises = [
  { title: "Full ingredient list", body: "the complete list on every product page and pack — nothing hidden." },
  { title: "Cruelty-free", body: "never tested on animals, full stop." },
  { title: "Made in India", body: "formulated and made here, close to the people we make it for." },
  { title: "Everyday pricing", body: "priced so daily care is something you can actually keep up." },
];

const rituals = [
  {
    title: "Kind, not harsh",
    body: "Cleans and cares without leaving skin tight or stripped — a finish you'll happily reach for on the fiftieth day, not just the first.",
    tone: "bg-fig-terracotta",
  },
  {
    title: "Made to repeat",
    body: "Formulated to sit easily inside the routine you already have, so the good habit becomes the easy option — tomorrow, and the day after.",
    tone: "bg-fig-sage",
  },
  {
    title: "Honestly priced",
    body: "Mid-premium quality at an everyday price. Care only works when you can afford to repeat it, so we made sure you can.",
    tone: "bg-fig-mustard",
  },
] as const;

/** Non-character hero motif: a care bottle with floating droplet accents. */
function HeroMotif() {
  return (
    <div className="relative w-[min(300px,66vw)] aspect-[3/4]" aria-hidden="true">
      {/* floating accents */}
      <span className="absolute top-6 left-2 w-4 h-4 rounded-full bg-fig-sage animate-float" style={{ animationDelay: "0s" }} />
      <span className="absolute top-20 right-3 w-6 h-6 rounded-full bg-fig-mustard animate-float" style={{ animationDelay: "1.1s" }} />
      <span className="absolute bottom-16 left-0 w-3 h-3 rounded-full bg-fig-cream/70 animate-float" style={{ animationDelay: "2.2s" }} />
      {/* bottle */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="animate-float" style={{ animationDelay: "0.4s" }}>
          <svg viewBox="0 0 160 220" className="w-[190px] h-auto drop-shadow-2xl">
            <rect x="62" y="10" width="36" height="26" rx="7" fill="#E0A93B" stroke="#252B42" strokeWidth="4" />
            <rect x="46" y="40" width="68" height="164" rx="26" fill="#D9814F" stroke="#252B42" strokeWidth="4" />
            <rect x="46" y="92" width="68" height="60" fill="#F7F3EC" opacity="0.14" />
            <circle cx="80" cy="120" r="19" fill="#F7F3EC" opacity="0.9" />
            <path d="M80 108 v24 M68 120 h24" stroke="#252B42" strokeWidth="4" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    </div>
  );
}

/** Non-character motif for the "in the lab" card. */
function LabMotif() {
  return (
    <div className="relative flex items-center justify-center h-[190px]" aria-hidden="true">
      <span className="absolute inset-0 m-auto w-28 h-28 rounded-full bg-fig-sage/25 animate-float" style={{ animationDelay: "0.6s" }} />
      <svg viewBox="0 0 120 120" className="relative w-24 h-24 animate-float">
        <circle cx="60" cy="60" r="40" fill="none" stroke="#252B42" strokeWidth="4" opacity="0.5" />
        <path d="M60 30 C 60 30, 82 56, 82 72 A 22 22 0 0 1 38 72 C 38 56, 60 30, 60 30 Z" fill="#D9814F" stroke="#252B42" strokeWidth="4" strokeLinejoin="round" />
        <circle cx="51" cy="70" r="6" fill="#F7F3EC" opacity="0.85" />
      </svg>
    </div>
  );
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
      {/* ── HERO (navy) ── */}
      <section className="relative bg-fig-navy text-fig-cream overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pt-20 lg:pb-24 flex flex-wrap items-center gap-10">
          <div className="flex-1 basis-[420px] min-w-0">
            <p className="fig-eyebrow text-fig-mustard mb-5">
              Personal care · Made in Hyderabad
            </p>
            <h1 className="font-fig font-bold text-[clamp(2.6rem,6vw,4.4rem)] leading-[1.05] tracking-tight [text-wrap:balance]">
              Care that keeps up with&nbsp;you.
            </h1>
            <p className="font-fig-body text-lg text-[#C9CCDC] max-w-[52ch] mt-5 mb-8 leading-relaxed">
              Everyday essentials made to feel good on your skin — thoughtfully
              formulated, honestly priced, and easy to fold into the routine you
              already have.
            </p>
            <div className="flex flex-wrap gap-3.5">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 rounded-full bg-fig-terracotta hover:bg-fig-terracotta-deep text-[#FFF6EE] font-fig font-semibold px-7 py-3.5 transition-all duration-150 hover:-translate-y-px"
              >
                Shop the range <ArrowRight size={15} />
              </Link>
              <Link
                href="#promise"
                className="inline-flex items-center gap-2 rounded-full border-2 border-fig-cream/35 hover:border-fig-cream/70 text-fig-cream font-fig font-semibold px-7 py-3.5 transition-colors"
              >
                Our promise
              </Link>
            </div>
            <div className="flex flex-wrap gap-6 mt-9">
              {["Cruelty-free", "Full ingredient list", "Made in India"].map((t) => (
                <span key={t} className="flex items-center gap-2 text-[13px] text-[#C9CCDC]">
                  <i className="w-[7px] h-[7px] rounded-full bg-fig-sage inline-block flex-none" />
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div className="flex-none basis-[300px] grow-0 mx-auto flex justify-center">
            <HeroMotif />
          </div>
        </div>
        <div className="absolute left-0 right-0 bottom-8 h-px bg-gradient-to-r from-transparent via-fig-cream/20 to-transparent" aria-hidden="true" />
      </section>

      {/* ── THE RANGE (cream) ── */}
      <section id="shop" className="bg-fig-cream py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateIn>
            <p className="fig-eyebrow text-fig-terracotta mb-4">
              The range
            </p>
            <h2 className="font-fig font-bold text-fig-navy text-[clamp(1.8rem,3.6vw,2.6rem)] leading-tight [text-wrap:balance]">
              Two essentials today. More, slowly.
            </h2>
            <p className="font-fig-body text-fig-ink-soft text-lg mt-3 max-w-[58ch]">
              We add a product only when it clears the same bar as the last one —
              no filler SKUs, no fifty-variant walls.
            </p>
          </AnimateIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-11">
            {featured.slice(0, 2).map((p, i) => (
              <AnimateIn key={p.id} delay={i * 0.08}>
                <HomeProductCard product={p} index={i} />
              </AnimateIn>
            ))}

            {/* in-the-lab teaser */}
            <AnimateIn delay={0.16}>
              <article className="bg-fig-paper border-[1.5px] border-fig-navy/10 rounded-3xl overflow-hidden flex flex-col h-full">
                <div className="relative flex items-end justify-center p-6 bg-gradient-to-br from-fig-sage/30 to-fig-sage/10">
                  <span className="absolute top-4 left-4 font-fig font-semibold text-[11px] tracking-[0.1em] uppercase border-[1.5px] border-fig-navy/15 text-fig-ink-soft rounded-full px-3 py-1.5">
                    In the lab
                  </span>
                  <LabMotif />
                </div>
                <div className="flex flex-col gap-2 p-6 flex-1">
                  <span className="font-fig font-semibold text-[11px] tracking-[0.12em] uppercase text-fig-terracotta">
                    Next up
                  </span>
                  <h3 className="font-fig font-bold text-xl text-fig-navy leading-tight">The third essential</h3>
                  <p className="font-fig-body text-sm text-fig-ink-soft">
                    In formulation now. It ships when it clears the bar — join the
                    list below and you&apos;ll hear first.
                  </p>
                  <div className="mt-auto pt-4">
                    <span className="font-fig font-semibold text-fig-ink-soft">Untitled, for now</span>
                  </div>
                  <a
                    href="#notify"
                    className="mt-3 inline-flex items-center justify-center rounded-full bg-fig-navy hover:bg-fig-navy-soft text-fig-cream font-fig font-semibold text-[15px] px-6 py-3 transition-all duration-150 hover:-translate-y-px"
                  >
                    Get notified
                  </a>
                </div>
              </article>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* ── WHY FLUNO (terracotta) ── */}
      <section className="bg-fig-terracotta py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateIn>
            <p className="fig-eyebrow text-fig-navy mb-4">
              Why Fluno
            </p>
            <h2 className="font-fig font-bold text-[#FFF6EE] text-[clamp(1.8rem,3.6vw,2.6rem)] leading-tight [text-wrap:balance]">
              Made for everyday life.
            </h2>
            <p className="font-fig-body text-[#F8DFC9] text-lg mt-3 max-w-[58ch]">
              Every formula follows three rules. If a product can&apos;t keep all
              three, it doesn&apos;t ship.
            </p>
          </AnimateIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-11">
            {rituals.map((r, i) => (
              <AnimateIn key={r.title} delay={i * 0.08}>
                <div className="bg-[#FFFDF9]/10 border-[1.5px] border-[#FFFDF9]/20 rounded-3xl p-7 h-full">
                  <h3 className="font-fig font-semibold text-lg text-[#FFF6EE] flex items-center gap-3">
                    <span className={`w-11 h-11 rounded-full ${r.tone} border-[2.5px] border-fig-navy flex items-center justify-center flex-none font-fig font-bold text-fig-navy`}>
                      {i + 1}
                    </span>
                    {r.title}
                  </h3>
                  <p className="font-fig-body text-sm text-[#F8DFC9] leading-relaxed mt-3.5">{r.body}</p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── OUR PROMISE (sage) ── */}
      <section id="promise" className="bg-fig-sage py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center gap-12">
          <div className="flex-1 basis-[420px]">
            <AnimateIn>
              <p className="fig-eyebrow text-fig-navy mb-4">
                The Fluno promise
              </p>
              <h2 className="font-fig font-bold text-fig-navy text-[clamp(1.8rem,3.6vw,2.6rem)] leading-tight [text-wrap:balance]">
                Care, done honestly.
              </h2>
              <p className="font-fig-body text-fig-navy/75 text-lg mt-3 max-w-[56ch]">
                A few simple commitments sit behind every Fluno product:
              </p>
              <ul className="mt-7 grid gap-3.5 max-w-[54ch]">
                {promises.map((s) => (
                  <li key={s.title} className="flex gap-3.5 items-start text-fig-navy">
                    <span className="flex-none w-6 h-6 rounded-full bg-fig-navy text-fig-cream flex items-center justify-center text-[11px] mt-0.5">
                      ✓
                    </span>
                    <span className="font-fig-body text-[15px] leading-relaxed">
                      <b className="font-fig font-semibold">{s.title}</b> — {s.body}
                    </span>
                  </li>
                ))}
              </ul>
            </AnimateIn>
          </div>
          <div className="flex-none basis-[280px] grow-0 mx-auto">
            <AnimateIn direction="left">
              <div className="grid grid-cols-2 gap-4 w-[min(280px,72vw)]" aria-hidden="true">
                <div className="aspect-square rounded-3xl bg-fig-terracotta animate-float" style={{ animationDelay: "0s" }} />
                <div className="aspect-square rounded-3xl bg-fig-mustard animate-float" style={{ animationDelay: "0.8s" }} />
                <div className="aspect-square rounded-3xl bg-fig-navy animate-float" style={{ animationDelay: "1.6s" }} />
                <div className="aspect-square rounded-3xl bg-fig-cream animate-float" style={{ animationDelay: "2.4s" }} />
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* ── LAUNCH LIST (mustard) ── */}
      <NotifyStrip />
    </>
  );
}
