import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

const posts: Record<string, {
  title: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
  content: string;
}> = {
  "spf-50-vs-spf-30-which-do-you-need": {
    title: "SPF 50 vs SPF 30: Which One Do You Actually Need?",
    date: "June 20, 2025",
    readTime: "4 min read",
    category: "Sun Care",
    image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=1200&q=80",
    content: `SPF 30 blocks about 97% of UVB rays. SPF 50 blocks about 98%. The difference sounds small — and technically, it is. But in practice, there are two reasons to choose higher.

**You never apply enough sunscreen.**
Studies consistently show people apply 25–50% of the recommended amount. That brings your real-world SPF 30 protection down to around SPF 8–10. With SPF 50 as your starting point, your actual protection ends up closer to what SPF 30 promises in theory.

**Indian climate and skin tone require more protection.**
Higher ambient UV index, longer sun exposure during commutes and outdoor work, and skin tones more prone to hyperpigmentation (rather than burning) all argue for the higher SPF.

**What Fluno's approach is:**
Our sunscreen is SPF 50+ PA++++ — the highest PA rating available, covering UVA protection that most brands understate. We formulated using EU-approved UV filters specifically because the Indian market deserves better than the minimum.

**The bottom line:**
If you're applying correctly, either SPF is fine for casual indoor days. For Indian conditions, commuting, sports, or beach days — use SPF 50+. Every time.`,
  },
  "why-eu-uv-filters-matter": {
    title: "Why EU UV Filters Are the Gold Standard",
    date: "June 10, 2025",
    readTime: "6 min read",
    category: "Ingredients",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1200&q=80",
    content: `The European Union has approved over 30 UV filters for use in sunscreens. The United States has approved 16 — and most of those were grandfathered in before modern safety testing existed. India's approved list sits somewhere in between, with limited public transparency.

**Why it matters:**
Newer UV filters like Tinosorb S (Bis-Ethylhexyloxyphenol Methoxyphenyl Triazine) and Tinosorb M offer broader spectrum coverage with better photostability than older filters like oxybenzone or octinoxate. They break down less in sunlight, providing more consistent protection throughout the day.

**What Fluno chose:**
Our SPF 50+ sunscreen uses EU-approved UV filters exclusively. This means you're getting the same formulation quality you'd find in a European pharmacy product — in a format designed for Indian skin and Indian prices.

**The honest caveat:**
More UV filters doesn't automatically mean a better product. What matters is the combination, concentration, and the rest of the formula. Our formulation team worked with Dr. Sai Prasad to get this right.`,
  },
  "hand-wash-mistakes-most-people-make": {
    title: "The 5 Hand Wash Mistakes Most People Make",
    date: "May 28, 2025",
    readTime: "3 min read",
    category: "Hand Care",
    image: "https://images.unsplash.com/photo-1584305574647-0cc949a2bb9f?w=1200&q=80",
    content: `Hand washing is the single most effective way to prevent the spread of illness. Most people do it wrong. Here are the five most common mistakes.

**1. Not washing long enough.**
The WHO recommends 20 seconds minimum. Most people spend 6–8 seconds. Count it out once — you'll be surprised how long 20 seconds feels.

**2. Skipping between the fingers.**
Most bacteria accumulate in the spaces between fingers and under nails. Interlace your fingers and scrub.

**3. Using water that's too hot.**
Hot water doesn't kill more germs on your hands — your skin isn't a sterilisation chamber. What hot water does is strip your skin's natural oils faster, leading to dryness and cracking. Lukewarm is better.

**4. Not rinsing thoroughly.**
Soap residue left on hands can cause irritation, especially with SLS-heavy formulas. Rinse until the water runs clear.

**5. Using a harsh formula.**
Sulphates that strip your skin barrier make your hands more vulnerable, not less. A pH-balanced, sulphate-free formula like Fluno's cleans effectively without compromising your skin.`,
  },
  "ph-balanced-why-it-matters-skin": {
    title: "pH-Balanced: What It Actually Means",
    date: "May 15, 2025",
    readTime: "5 min read",
    category: "Skin Science",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=1200&q=80",
    content: `"pH-balanced" appears on almost every skincare product. Most brands use it as a marketing phrase. Here's what it actually means.

**pH basics:**
The pH scale runs 0–14. 7 is neutral. Below 7 is acidic, above 7 is alkaline. Healthy skin has a pH of approximately 4.5–5.5 — mildly acidic.

**Why your skin's pH matters:**
Your skin's acid mantle — a thin, slightly acidic film on the surface — acts as a barrier against bacteria, pollutants, and moisture loss. When you disrupt it with alkaline products, you weaken this barrier temporarily.

**What "pH-balanced" means for a hand wash:**
A properly pH-balanced hand wash (4.5–6.5 range) won't disrupt your skin's acid mantle. Traditional soaps, by comparison, are often pH 9–10 — alkaline enough to strip the barrier with repeated use. That's why people who wash their hands frequently with bar soap often have dry, cracked skin.

**Fluno's hand wash:**
Our formula is pH-balanced specifically to minimise disruption to the acid mantle, combined with glycerin and panthenol (vitamin B5) to actively support barrier function during and after washing.`,
  },
};

export function generateStaticParams() {
  return Object.keys(posts).map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const post = posts[params.slug];
  if (!post) return {};
  return {
    title: post.title,
    description: post.content.slice(0, 160),
  } satisfies Metadata;
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = posts[params.slug];
  if (!post) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="font-body text-fluno-ink/50">Post not found.</p>
        <Link href="/blog" className="btn-primary mt-6">
          Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/blog"
        className="flex items-center gap-2 text-sm font-body text-fluno-ink/40 hover:text-fluno-teal mb-8 transition-colors"
      >
        <ArrowLeft size={14} /> Back to Blog
      </Link>

      <span className="badge mb-4 block w-fit">{post.category}</span>
      <h1 className="font-display text-4xl md:text-5xl text-fluno-ink leading-tight">
        {post.title}
      </h1>
      <div className="flex items-center gap-3 mt-4 font-mono text-sm text-fluno-ink/40">
        <span>{post.date}</span>
        <span>·</span>
        <span>{post.readTime}</span>
        <span>·</span>
        <span>Fluno Team</span>
      </div>

      <div className="mt-8 aspect-[16/9] relative rounded-sm overflow-hidden bg-fluno-stone/20">
        <Image
          src={post.image}
          alt={post.title}
          fill
          priority
          className="object-cover"
        />
      </div>

      <div className="mt-10 prose prose-lg max-w-none font-body text-fluno-ink/80 leading-relaxed space-y-5">
        {post.content.split("\n\n").map((para, i) => {
          if (para.startsWith("**") && para.endsWith("**")) {
            return (
              <h2 key={i} className="font-display text-2xl text-fluno-ink mt-8 mb-2">
                {para.replace(/\*\*/g, "")}
              </h2>
            );
          }
          const formatted = para.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
          return (
            <p key={i} dangerouslySetInnerHTML={{ __html: formatted }} />
          );
        })}
      </div>

      <div className="mt-12 pt-8 border-t border-fluno-stone/40">
        <p className="font-display text-xl text-fluno-ink mb-2">
          Try the products behind the science.
        </p>
        <Link href="/shop" className="btn-primary mt-4">
          Shop Fluno
        </Link>
      </div>
    </article>
  );
}
