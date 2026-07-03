import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { connectDB } from "@/lib/mongodb";
import { ProductModel } from "@/lib/models/Product";
import { getFeaturedProducts } from "@/lib/products";
import { FigRunner, FigSeeker, FigListener } from "@/components/fig/Fig";
import ScrollTraveler from "@/components/fig/ScrollTraveler";
import HomeProductCard from "@/components/fig/HomeProductCard";
import NotifyStrip from "@/components/fig/NotifyStrip";
import AnimateIn from "@/components/AnimateIn";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Fluno — Care that keeps up with you",
  description:
    "Dermatologist-tested personal care formulated to EU ingredient standards, priced for every day. Made in Hyderabad, India.",
};

interface RawProduct {
  _id: unknown; slug: string; name: string; tagline?: string; price: number;
  originalPrice?: number; size?: string; category?: string; rating?: number;
  reviewCount?: number; images?: string[]; description?: string;
  ingredients?: string[]; howToUse?: string[]; benefits?: string[];
  badges?: string[]; inStock?: boolean; featured?: boolean;
}

const rituals = [
  {
    title: "Gentle, not weak",
    body: "Sulphate-free surfactants and pH-balanced formulas clean properly without stripping skin — soft hands after the fiftieth wash, not just the first.",
    pose: "runner",
  },
  {
    title: "Held to EU standards",
    body: "We formulate to EU and UK ingredient rules — stricter than what's required here — because the safest list should be the default, not the import.",
    pose: "leap",
  },
  {
    title: "Priced for daily use",
    body: "Mid-premium quality at an everyday price. Care only works when you can afford to repeat it — tomorrow, and the day after.",
    pose: "dancer",
  },
] as const;

const standards = [
  { title: "EU/UK ingredient standards", body: "including UV filters approved under the strictest safety reviews in the world." },
  { title: "Dermatologist tested", body: "every formula, before launch, signed off by Dr. Sai Prasad, MBBS." },
  { title: "pH balanced", body: "matched to skin so daily use never becomes daily damage." },
  { title: "Full ingredient disclosure", body: "the complete INCI list on every product page, not just the flattering half." },
];

/** small pose glyphs for the ritual cards */
function RitualGlyph({ pose }: { pose: string }) {
  return (
    <span className="w-11 h-11 rounded-full bg-fig-cream border-[2.5px] border-fig-navy flex items-center justify-center flex-none">
      <svg viewBox="0 0 200 260" className="w-[26px] h-[26px]" aria-hidden="true">
        {pose === "runner" && (
          <>
            <path d="M104 112 C 88 122, 72 120, 62 104" fill="none" stroke="#D9814F" strokeWidth="16" strokeLinecap="round" />
            <path d="M108 100 L 99 150" fill="none" stroke="#D9814F" strokeWidth="44" strokeLinecap="round" />
            <circle cx="123" cy="71" r="26" fill="#F7F3EC" stroke="#252B42" strokeWidth="6" />
          </>
        )}
        {pose === "leap" && (
          <>
            <path d="M92 88 C 76 72, 68 56, 66 40" fill="none" stroke="#252B42" strokeWidth="16" strokeLinecap="round" />
            <path d="M100 82 L 100 130" fill="none" stroke="#252B42" strokeWidth="44" strokeLinecap="round" />
            <circle cx="100" cy="52" r="26" fill="#F7F3EC" stroke="#252B42" strokeWidth="6" />
          </>
        )}
        {pose === "dancer" && (
          <>
            <path d="M106 100 C 124 80, 120 56, 98 48" fill="none" stroke="#E0A93B" strokeWidth="16" strokeLinecap="round" />
            <path d="M102 100 L 104 152" fill="none" stroke="#E0A93B" strokeWidth="44" strokeLinecap="round" />
            <circle cx="88" cy="72" r="26" fill="#F7F3EC" stroke="#252B42" strokeWidth="6" />
          </>
        )}
      </svg>
    </span>
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
      <ScrollTraveler />

      {/* ── HERO (navy) ── */}
      <section className="relative bg-fig-navy text-fig-cream overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pt-20 lg:pb-24 flex flex-wrap items-center gap-10">
          <div className="flex-1 basis-[420px] min-w-0">
            <p className="font-fig font-semibold text-[11px] tracking-[0.16em] uppercase text-fig-mustard mb-5">
              Personal care · EU ingredient standards · Hyderabad
            </p>
            <h1 className="font-fig font-bold text-[clamp(2.6rem,6vw,4.4rem)] leading-[1.05] tracking-tight [text-wrap:balance]">
              Care that keeps up with&nbsp;you.
            </h1>
            <p className="font-fig-body text-lg text-[#C9CCDC] max-w-[52ch] mt-5 mb-8 leading-relaxed">
              Dermatologist-tested essentials formulated to EU and UK ingredient
              standards — the strictest lists we could find — and priced for every
              single day.
            </p>
            <div className="flex flex-wrap gap-3.5">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 rounded-full bg-fig-terracotta hover:bg-fig-terracotta-deep text-[#FFF6EE] font-fig font-semibold px-7 py-3.5 transition-all duration-150 hover:-translate-y-px"
              >
                Shop the range <ArrowRight size={15} />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 rounded-full border-2 border-fig-cream/35 hover:border-fig-cream/70 text-fig-cream font-fig font-semibold px-7 py-3.5 transition-colors"
              >
                Read our standards
              </Link>
            </div>
            <div className="flex flex-wrap gap-6 mt-9">
              {["Dermatologist tested", "pH balanced", "Sulphate-free cleansing"].map((t) => (
                <span key={t} className="flex items-center gap-2 text-[13px] text-[#C9CCDC]">
                  <i className="w-[7px] h-[7px] rounded-full bg-fig-sage inline-block flex-none" />
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div className="flex-none basis-[300px] grow-0 mx-auto flex justify-center">
            <FigRunner animate darkGround className="w-[min(290px,64vw)] h-auto" />
          </div>
        </div>
        <div className="absolute left-0 right-0 bottom-8 h-px bg-gradient-to-r from-transparent via-fig-cream/20 to-transparent" aria-hidden="true" />
      </section>

      {/* ── THE RANGE (cream) ── */}
      <section id="shop" className="bg-fig-cream py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateIn>
            <p className="font-fig font-semibold text-[11px] tracking-[0.16em] uppercase text-fig-terracotta mb-4">
              The range
            </p>
            <h2 className="font-fig font-bold text-fig-navy text-[clamp(1.8rem,3.6vw,2.6rem)] leading-tight [text-wrap:balance]">
              Two essentials today. More, slowly.
            </h2>
            <p className="font-fig-body text-fig-ink-soft text-lg mt-3 max-w-[58ch]">
              We add a product only when it clears the same standards bar as the
              last one — no filler SKUs, no fifty-variant walls.
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
                <div className="relative flex items-end justify-center min-h-[250px] p-6 bg-gradient-to-br from-fig-sage/30 to-fig-sage/10">
                  <span className="absolute top-4 left-4 font-fig font-semibold text-[11px] tracking-[0.1em] uppercase border-[1.5px] border-fig-navy/15 text-fig-ink-soft rounded-full px-3 py-1.5">
                    In the lab
                  </span>
                  <FigSeeker animate className="h-[210px] w-auto" />
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
            <p className="font-fig font-semibold text-[11px] tracking-[0.16em] uppercase text-fig-navy mb-4">
              Why Fluno
            </p>
            <h2 className="font-fig font-bold text-[#FFF6EE] text-[clamp(1.8rem,3.6vw,2.6rem)] leading-tight [text-wrap:balance]">
              Made for bodies in motion.
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
                    <RitualGlyph pose={r.pose} />
                    {r.title}
                  </h3>
                  <p className="font-fig-body text-sm text-[#F8DFC9] leading-relaxed mt-3.5">{r.body}</p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── OUR STANDARDS (sage) ── */}
      <section id="standards" className="bg-fig-sage py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center gap-12">
          <div className="flex-1 basis-[420px]">
            <AnimateIn>
              <p className="font-fig font-semibold text-[11px] tracking-[0.16em] uppercase text-fig-navy mb-4">
                Our standards
              </p>
              <h2 className="font-fig font-bold text-fig-navy text-[clamp(1.8rem,3.6vw,2.6rem)] leading-tight [text-wrap:balance]">
                The boring paperwork, done properly.
              </h2>
              <p className="font-fig-body text-fig-navy/75 text-lg mt-3 max-w-[56ch]">
                Founded in Hyderabad by a CEO who reads ingredient lists and a
                doctor who signs off on them. This is the bar every Fluno product
                clears:
              </p>
              <ul className="mt-7 grid gap-3.5 max-w-[54ch]">
                {standards.map((s) => (
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
          <div className="flex-none basis-[280px] grow-0 mx-auto flex justify-center">
            <FigListener className="w-[min(260px,58vw)] h-auto" />
          </div>
        </div>
      </section>

      {/* ── LAUNCH LIST (mustard) ── */}
      <NotifyStrip />
    </>
  );
}
