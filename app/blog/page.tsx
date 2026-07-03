import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Clock, ArrowRight } from "lucide-react";
import { connectDB } from "@/lib/mongodb";
import { BlogModel } from "@/lib/models/Blog";
import AnimateIn from "@/components/AnimateIn";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog — The Fluno Journal",
  description:
    "Science-backed skincare insights for Indian skin. Ingredient deep-dives, routine guides, and honest advice from the Fluno team.",
};

const CATEGORIES = [
  "All",
  "Skincare",
  "Ingredients",
  "Routine",
  "Hygiene",
  "Wellness",
  "Sunscreen",
] as const;

interface Post {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  coverImage?: string;
  category?: string;
  readTime?: string;
  createdAt: string;
}

async function getPosts(category?: string): Promise<Post[]> {
  try {
    await connectDB();
    const filter: Record<string, unknown> = { published: true };
    if (category && category !== "All") filter.category = category;
    const posts = await BlogModel.find(filter)
      .sort({ createdAt: -1 })
      .lean();
    return JSON.parse(JSON.stringify(posts));
  } catch {
    return [];
  }
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const activeCategory = searchParams.category ?? "All";
  const posts = await getPosts(activeCategory);

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative bg-fig-navy overflow-hidden py-28 md:py-36">
        {/* Ambient glow orbs */}
        <div
          aria-hidden
          className="absolute -top-40 -left-40 w-[520px] h-[520px] rounded-full
                     bg-fig-terracotta/20 blur-[130px] pointer-events-none animate-orb1"
        />
        <div
          aria-hidden
          className="absolute -bottom-24 -right-10 w-[420px] h-[420px] rounded-full
                     bg-fig-terracotta-deep/15 blur-[110px] pointer-events-none animate-orb2"
        />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="fig-eyebrow text-fig-mustard/60 mb-5">The Fluno Journal</p>
          <h1 className="font-fig font-bold text-6xl md:text-8xl text-white leading-[1.05] tracking-tight">
            The{" "}
            <span className="text-fig-terracotta text-glow">Fluno</span> Blog
          </h1>
          <p className="mt-6 font-fig-body text-lg md:text-xl text-white/50 max-w-lg mx-auto leading-relaxed">
            Science-backed skincare insights for Indian skin.
          </p>
        </div>
      </section>

      {/* ── Category filter chips ── */}
      <div className="sticky top-0 z-20 bg-fig-cream/90 backdrop-blur-md border-b border-fig-sage/70 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="flex items-center gap-2 overflow-x-auto py-3
                       [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {CATEGORIES.map((cat) => {
              const isActive = cat === activeCategory;
              return (
                <Link
                  key={cat}
                  href={cat === "All" ? "/blog" : `/blog?category=${cat}`}
                  className={`shrink-0 px-4 py-1.5 rounded-full font-fig-body text-sm font-medium
                              transition-all duration-200 ${
                    isActive
                      ? "bg-fig-terracotta text-fig-navy shadow-md shadow-fig-terracotta/30"
                      : "bg-white border border-fig-sage text-fig-ink-soft hover:border-fig-terracotta hover:text-fig-terracotta"
                  }`}
                >
                  {cat}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Post grid ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {posts.length === 0 ? (
          <EmptyState category={activeCategory} />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, i) => (
              <AnimateIn key={post._id} delay={i * 0.07} direction="up">
                <BlogCard post={post} />
              </AnimateIn>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

/* ─── Blog bg-fig-paper border border-fig-navy/10 rounded-2xl ─────────────────────────────────────────────────────── */

function BlogCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="bg-fig-paper border border-fig-navy/10 rounded-2xl group flex flex-col h-full"
    >
      {/* Cover image */}
      <div className="relative aspect-[16/9] overflow-hidden bg-fig-sage/40">
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-fig-terracotta/20 via-fig-sage to-fig-mustard/20 flex items-center justify-center">
            <span className="font-fig font-bold text-5xl text-fig-terracotta/25">F</span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        {post.category && (
          <span className="fig-badge mb-3 w-fit">{post.category}</span>
        )}
        <h3 className="font-fig font-bold text-lg text-fig-navy group-hover:text-fig-terracotta transition-colors leading-snug flex-1">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="font-fig-body text-sm text-fig-ink-soft mt-2 leading-relaxed line-clamp-2">
            {post.excerpt}
          </p>
        )}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-fig-sage/60">
          {post.readTime ? (
            <span className="flex items-center gap-1.5 font-fig-body text-xs text-fig-ink-soft">
              <Clock size={12} />
              {post.readTime}
            </span>
          ) : (
            <span />
          )}
          <span className="flex items-center gap-1 font-fig-body text-sm font-semibold text-fig-terracotta group-hover:gap-2 transition-all duration-200">
            Read More <ArrowRight size={14} />
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ─── Empty state ────────────────────────────────────────────────────── */

function EmptyState({ category }: { category: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-28 text-center">
      {/* Decorative orb */}
      <div className="relative mb-8">
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-fig-terracotta/25 to-fig-mustard/20 flex items-center justify-center">
          <span className="font-fig font-bold text-6xl text-fig-terracotta/50">F</span>
        </div>
        <div className="absolute inset-0 rounded-full blur-2xl bg-fig-terracotta/10" />
      </div>

      <h2 className="font-fig font-bold text-4xl text-fig-navy mb-3">
        {category === "All"
          ? "Great content coming soon"
          : `No ${category} posts yet`}
      </h2>
      <p className="font-fig-body text-fig-ink-soft max-w-sm leading-relaxed">
        We&apos;re crafting science-backed skincare insights for Indian skin.
        Check back soon for expert articles, routine guides, and ingredient
        deep-dives.
      </p>

      {category !== "All" && (
        <Link href="/blog" className="fig-btn-outline mt-8">
          View all posts
        </Link>
      )}
    </div>
  );
}
