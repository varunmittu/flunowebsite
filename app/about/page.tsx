import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ScrollText, Rabbit, MapPin, Wallet } from "lucide-react";

export const metadata: Metadata = {
  title: "About Fluno",
  description:
    "Fluno makes everyday personal care essentials — thoughtfully formulated, cruelty-free, and honestly priced. Here's what we stand for.",
};

const values = [
  {
    title: "Full ingredient list",
    body: "Every ingredient, on every pack and product page. Nothing hidden, nothing buried in fine print.",
    Icon: ScrollText,
    tone: "bg-fig-terracotta",
  },
  {
    title: "Cruelty-free",
    body: "Never tested on animals. Full stop — no exceptions, no asterisks.",
    Icon: Rabbit,
    tone: "bg-fig-sage",
  },
  {
    title: "Made in India",
    body: "Formulated and made here, for the people we make it for.",
    Icon: MapPin,
    tone: "bg-fig-sky",
  },
  {
    title: "Honestly priced",
    body: "Mid-premium quality at an everyday price, so good habits are easy to keep.",
    Icon: Wallet,
    tone: "bg-fig-mustard",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* ── HERO (paper) ── */}
      <section className="bg-fig-paper">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-16 lg:pt-20 lg:pb-20">
          <div className="reveal">
            <p className="fig-eyebrow text-fig-terracotta mb-4">About Fluno</p>
            <h1 className="font-fig font-bold text-fig-navy text-[clamp(2.4rem,6vw,4rem)] leading-[1.05] tracking-tight [text-wrap:balance] max-w-[18ch]">
              Personal care that earns its place in your routine.
            </h1>
            <p className="font-fig-body text-lg text-fig-ink-soft max-w-[58ch] mt-6 leading-relaxed">
              Fluno makes everyday personal care essentials — hand wash, sunscreen,
              and more — that are thoughtfully formulated, cruelty-free, and honestly
              priced. No hype, no fine print. Just care you can actually keep up with.
            </p>
          </div>
        </div>
      </section>

      {/* ── WHY (mint) ── */}
      <section className="bg-fig-sage border-y-[3px] border-fig-navy py-16 lg:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 reveal">
          <p className="fig-eyebrow text-fig-navy/70 mb-3">Why we exist</p>
          <h2 className="font-fig font-bold text-fig-navy text-[clamp(1.8rem,4vw,2.6rem)] leading-tight [text-wrap:balance] max-w-[20ch]">
            Good care shouldn&apos;t be complicated.
          </h2>
          <p className="font-fig-body text-fig-navy/80 text-lg mt-4 max-w-[62ch] leading-relaxed">
            Most personal care asks you to pick a side — quality or price, clean
            formulas or ones that actually work. Fluno was built to remove that
            trade-off: mid-premium products, made with care, at a price that lets
            you reach for them every single day.
          </p>
        </div>
      </section>

      {/* ── VALUES (paper) ── */}
      <section className="bg-fig-paper py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="reveal">
            <p className="fig-eyebrow text-fig-terracotta mb-3">What we stand for</p>
            <h2 className="font-fig font-bold text-fig-navy text-[clamp(1.8rem,4vw,2.6rem)] leading-tight [text-wrap:balance]">
              Four commitments behind every product.
            </h2>
          </div>
          <div className="reveal-stagger grid grid-cols-1 md:grid-cols-2 gap-5 mt-10">
            {values.map((v) => (
              <div
                key={v.title}
                className="bg-fig-paper border-[2.5px] border-fig-navy rounded-3xl p-7 shadow-[5px_5px_0_0_#2C2A27] flex gap-5"
              >
                <span className={`w-14 h-14 flex-none rounded-2xl ${v.tone} border-[2.5px] border-fig-navy flex items-center justify-center`}>
                  <v.Icon size={24} className="text-fig-navy" />
                </span>
                <div>
                  <h3 className="font-fig font-bold text-xl text-fig-navy">{v.title}</h3>
                  <p className="font-fig-body text-sm text-fig-ink-soft leading-relaxed mt-2">{v.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW WE WORK (lilac) ── */}
      <section className="bg-fig-lilac border-y-[3px] border-fig-navy py-16 lg:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-start gap-10">
          <div className="flex-1 basis-[300px] reveal">
            <p className="fig-eyebrow text-fig-navy/70 mb-3">How we work</p>
            <h2 className="font-fig font-bold text-fig-navy text-[clamp(1.8rem,4vw,2.6rem)] leading-tight [text-wrap:balance]">
              We add a product only when it&apos;s ready.
            </h2>
          </div>
          <div className="flex-1 basis-[320px] reveal">
            <p className="font-fig-body text-fig-navy/80 text-lg leading-relaxed">
              No filler SKUs, no fifty-variant walls. Every Fluno essential has to
              clear the same bar as the last one before it ships — so the range
              grows slowly, and each product earns its spot.
            </p>
            <p className="font-fig-body text-fig-navy/70 mt-4 leading-relaxed">
              Fluno is built and run by <strong className="font-semibold">Parvar Enterprise</strong>,
              a small team in India focused on making dependable, everyday personal care.
            </p>
          </div>
        </div>
      </section>

      {/* ── CTA (coral) ── */}
      <section className="bg-fig-terracotta py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center reveal">
          <h2 className="font-fig font-bold text-fig-navy text-[clamp(1.9rem,4.5vw,2.9rem)] leading-tight [text-wrap:balance]">
            Care that keeps up with you.
          </h2>
          <p className="font-fig-body text-fig-navy/80 text-lg mt-3 max-w-[46ch] mx-auto">
            Have a look at the range, or say hello — we read every message.
          </p>
          <div className="flex flex-wrap gap-3.5 justify-center mt-8">
            <Link href="/shop" className="fig-btn-navy text-base px-7 py-3.5">
              Shop the range <ArrowRight size={16} />
            </Link>
            <Link href="/contact" className="fig-btn-outline text-base px-7 py-3.5">
              Get in touch
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
