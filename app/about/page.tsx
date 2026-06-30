import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Leaf, ShieldCheck, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn the story behind Fluno — a personal care brand built on clean ingredients and honest formulations from Hyderabad, India.",
};

const team = [
  {
    name: "Avinash Mohan V",
    role: "Founder & CEO",
    bio: "Brand strategy, marketing, and go-to-market. Building Fluno from the ground up with a focus on customer trust and long-term quality.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80",
  },
  {
    name: "Dr. Sai Prasad, MBBS",
    role: "COO — R&D & Manufacturing",
    bio: "Medical background applied to product formulation. Ensures every Fluno product meets clinical-grade safety and efficacy standards.",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&q=80",
  },
];

const milestones = [
  { year: "2024", event: "Fluno founded in Hyderabad under Parvar Enterprise" },
  { year: "2024", event: "First product launch: Fluno Hand Wash (₹80 / 250ml)" },
  { year: "2024", event: "1,000+ units sold — zero paid marketing" },
  { year: "2025", event: "50%+ repeat purchase rate achieved" },
  { year: "2025", event: "SPF 50+ PA++++ sunscreen enters formulation phase" },
  { year: "2025", event: "Amazon storefront launched" },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-fluno-ink text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_50%,#1E5C5630,transparent_70%)] pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="font-mono text-xs tracking-widest text-fluno-blush uppercase mb-4">
            Our Story
          </p>
          <h1 className="font-display text-5xl md:text-6xl text-white max-w-2xl leading-tight">
            We started with a question nobody was answering.
          </h1>
          <p className="font-body text-white/60 mt-6 max-w-xl leading-relaxed text-lg">
            Why do most personal care products either cut corners on ingredients
            or charge luxury prices for the privilege? Fluno was our answer —
            formulated in Hyderabad, built for everyday India.
          </p>
        </div>
      </section>

      {/* Brand Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-3 gap-10">
          {[
            {
              icon: ShieldCheck,
              title: "Safety First",
              body: "We formulate against EU/UK ingredient-safety standards — more stringent than most Indian brands bother with. If an ingredient doesn't pass, it doesn't make it in.",
            },
            {
              icon: Leaf,
              title: "Clean Without the Premium",
              body: "\"Clean beauty\" shouldn't mean ₹2,000 moisturisers. Our products sit in the mid-premium range because quality formulas shouldn't require a luxury markup.",
            },
            {
              icon: Users,
              title: "Built on Repeat Trust",
              body: "Our 50%+ repeat rate isn't an accident. Every formula is designed so the second bottle is an easy decision — that's the standard we hold ourselves to.",
            },
          ].map((v) => (
            <div key={v.title} className="border-l-2 border-fluno-teal pl-6">
              <v.icon size={22} className="text-fluno-teal mb-3" />
              <h3 className="font-display text-xl text-fluno-ink mb-2">
                {v.title}
              </h3>
              <p className="font-body text-sm text-fluno-ink/60 leading-relaxed">
                {v.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Brand Story */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div className="aspect-[4/3] rounded-sm overflow-hidden bg-fluno-stone/20 relative">
              <Image
                src="https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80"
                alt="Fluno products"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="font-mono text-xs tracking-widest text-fluno-teal uppercase mb-4">
                The Brand
              </p>
              <h2 className="font-display text-4xl text-fluno-ink leading-tight">
                Parvar Enterprise,
                <br />
                Hyderabad.
              </h2>
              <div className="space-y-4 mt-6 font-body text-fluno-ink/70 leading-relaxed">
                <p>
                  Fluno was born out of Parvar Enterprise in Hyderabad — a
                  collaboration between brand strategy and medical science. We
                  believe the personal care aisle has been broken for too long:
                  mass-market products that cut corners, and luxury brands that
                  charge you for packaging.
                </p>
                <p>
                  Our flagship hand wash was the first test — could we make
                  something that genuinely feels premium, uses responsible
                  ingredients, and costs ₹80? The answer, and the 1,000+ units
                  sold since, told us we were onto something.
                </p>
                <p>
                  The sunscreen came next — formulated to EU/UK UV filter
                  standards because the Indian market deserved a product that
                  didn&apos;t just meet the minimum bar.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="section-title mb-12">Our Journey</h2>
        <div className="relative border-l-2 border-fluno-stone/40 pl-8 space-y-8 ml-2">
          {milestones.map((m, i) => (
            <div key={i} className="relative">
              <div className="absolute -left-[41px] w-4 h-4 rounded-full bg-fluno-teal border-4 border-fluno-bg" />
              <p className="font-mono text-xs text-fluno-teal uppercase tracking-widest">
                {m.year}
              </p>
              <p className="font-body text-fluno-ink/80 mt-1">{m.event}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">The Team</h2>
            <p className="section-sub">Two people. One obsession. Better formulas.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-10 max-w-3xl mx-auto">
            {team.map((t) => (
              <div key={t.name} className="text-center">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-fluno-stone/20 mx-auto mb-5 relative">
                  <Image
                    src={t.image}
                    alt={t.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="font-display text-xl text-fluno-ink">{t.name}</h3>
                <p className="font-mono text-xs text-fluno-teal uppercase tracking-wider mt-1">
                  {t.role}
                </p>
                <p className="font-body text-sm text-fluno-ink/60 mt-3 leading-relaxed">
                  {t.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-fluno-blush/20 py-16 border-t border-fluno-blush/30">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="section-title">Try Fluno. See why they come back.</h2>
          <p className="section-sub mt-2">
            1,000+ customers. 50%+ repeat rate. Zero paid ads.
          </p>
          <Link href="/shop" className="btn-primary mt-8">
            Shop Now <ArrowRight size={15} />
          </Link>
        </div>
      </section>
    </>
  );
}
