import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Skin care tips, ingredient deep-dives, and honest advice from the Fluno team.",
};

const posts = [
  {
    slug: "spf-50-vs-spf-30-which-do-you-need",
    title: "SPF 50 vs SPF 30: Which One Do You Actually Need?",
    excerpt:
      "The difference between SPF 30 and SPF 50 is smaller than brands want you to think — but there's still a clear winner for Indian skin and climate.",
    date: "June 20, 2025",
    readTime: "4 min read",
    category: "Sun Care",
    image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&q=80",
  },
  {
    slug: "why-eu-uv-filters-matter",
    title: "Why EU UV Filters Are the Gold Standard (And What India Uses Instead)",
    excerpt:
      "The EU has approved UV filters that the US and India haven't — yet. Here's what that means for your sunscreen and why Fluno chose EU-standard ingredients.",
    date: "June 10, 2025",
    readTime: "6 min read",
    category: "Ingredients",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80",
  },
  {
    slug: "hand-wash-mistakes-most-people-make",
    title: "The 5 Hand Wash Mistakes Most People Make (and How to Fix Them)",
    excerpt:
      "You've been washing your hands your whole life. You're probably doing two or three things wrong. A quick fix can make a real difference.",
    date: "May 28, 2025",
    readTime: "3 min read",
    category: "Hand Care",
    image: "https://images.unsplash.com/photo-1584305574647-0cc949a2bb9f?w=600&q=80",
  },
  {
    slug: "ph-balanced-why-it-matters-skin",
    title: "pH-Balanced: What It Actually Means and Why It Matters for Your Skin",
    excerpt:
      "Everyone's using the term. Few explain what it means. Here's a plain-English breakdown of skin pH and what happens when a product gets it wrong.",
    date: "May 15, 2025",
    readTime: "5 min read",
    category: "Skin Science",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=80",
  },
];

export default function BlogPage() {
  const [featured, ...rest] = posts;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      {/* Header */}
      <div className="mb-12">
        <p className="font-mono text-xs tracking-widest text-fluno-teal uppercase mb-2">
          Fluno Journal
        </p>
        <h1 className="section-title">Skin care, honestly.</h1>
        <p className="section-sub">
          Ingredient deep-dives, routine guides, and the science behind what
          works — without the marketing fluff.
        </p>
      </div>

      {/* Featured Post */}
      <Link href={`/blog/${featured.slug}`} className="block group mb-14">
        <div className="grid lg:grid-cols-2 gap-0 card overflow-hidden">
          <div className="aspect-[4/3] lg:aspect-auto relative overflow-hidden">
            <Image
              src={featured.image}
              alt={featured.title}
              fill
              priority
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="p-8 lg:p-12 flex flex-col justify-center">
            <span className="badge mb-4">{featured.category}</span>
            <h2 className="font-display text-3xl text-fluno-ink group-hover:text-fluno-teal transition-colors leading-tight">
              {featured.title}
            </h2>
            <p className="font-body text-fluno-ink/60 mt-4 leading-relaxed">
              {featured.excerpt}
            </p>
            <div className="flex items-center gap-3 mt-6 font-mono text-xs text-fluno-ink/40">
              <span>{featured.date}</span>
              <span>·</span>
              <span>{featured.readTime}</span>
            </div>
          </div>
        </div>
      </Link>

      {/* Post Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {rest.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="card group">
            <div className="aspect-[16/9] relative overflow-hidden">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-5">
              <span className="badge mb-3 block w-fit">{post.category}</span>
              <h3 className="font-display text-lg text-fluno-ink group-hover:text-fluno-teal transition-colors leading-snug">
                {post.title}
              </h3>
              <p className="font-body text-sm text-fluno-ink/60 mt-2 leading-relaxed line-clamp-2">
                {post.excerpt}
              </p>
              <div className="flex items-center gap-3 mt-4 font-mono text-xs text-fluno-ink/40">
                <span>{post.date}</span>
                <span>·</span>
                <span>{post.readTime}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
