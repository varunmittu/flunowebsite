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
      <section className="relative bg-fluno-dark overflow-hidden py-28 md:py-36">
        {/* Ambient glow orbs */}
        <div
          aria-hidden
          className="absolute -top-40 -left-40 w-[520px] h-[520px] rounded-full
                     bg-fluno-purple/20 blur-[130px] pointer-events-none animate-orb1"
        />
        <div
          aria-hidden
          className="absolute -bottom-24 -right-10 w-[420px] h-[420px] rounded-full
                     bg-fluno-purple-dark/15 blur-[110px] pointer-events-none animate-orb2"
        />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="eyebrow text-fluno-glow/60 mb-5">The Fluno Journal</p>
          <h1 className="font-brand text-6xl md:text-8xl text-white leading-[1.05] tracking-tight">
            The{" "}
            <span className="text-fluno-purple text-glow">Fluno</span> Blog
          </h1>
          <p className="mt-6 font-body text-lg md:text-xl text-white/50 max-w-lg mx-auto leading-relaxed">
            Science-backed skincare insights for Indian skin.
          </p>
        </div>
      </section>

      {/* ── Category filter chips ── */}
      <div className="sticky top-0 z-20 bg-fluno-light/90 backdrop-blur-md border-b border-fluno-lavender/70 shadow-sm">
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
                  className={`shrink-0 px-4 py-1.5 rounded-full font-body text-sm font-medium
                              transition-all duration-200 ${
                    isActive
                      ? "bg-fluno-purple text-white shadow-md shadow-fluno-purple/30"
                      : "bg-white border border-fluno-lavender text-fluno-muted hover:border-fluno-purple hover:text-fluno-purple"
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

/* ─── Blog card ─────────────────────────────────────────────────────── */

function BlogCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="card group flex flex-col h-full"
    >
      {/* Cover image */}
      <div className="relative aspect-[16/9] overflow-hidden bg-fluno-lavender/40">
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-fluno-purple/20 via-fluno-lavender to-fluno-glow/20 flex items-center justify-center">
            <span className="font-brand text-5xl text-fluno-purple/25">F</span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        {post.category && (
          <span className="badge mb-3 w-fit">{post.category}</span>
        )}
        <h3 className="font-display font-bold text-lg text-fluno-ink group-hover:text-fluno-purple transition-colors leading-snug flex-1">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="font-body text-sm text-fluno-muted mt-2 leading-relaxed line-clamp-2">
            {post.excerpt}
          </p>
        )}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-fluno-lavender/60">
          {post.readTime ? (
            <span className="flex items-center gap-1.5 font-mono text-xs text-fluno-muted">
              <Clock size={12} />
              {post.readTime}
            </span>
          ) : (
            <span />
          )}
          <span className="flex items-center gap-1 font-body text-sm font-semibold text-fluno-purple group-hover:gap-2 transition-all duration-200">
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
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-fluno-purple/25 to-fluno-glow/20 flex items-center justify-center">
          <span className="font-brand text-6xl text-fluno-purple/50">F</span>
        </div>
        <div className="absolute inset-0 rounded-full blur-2xl bg-fluno-purple/10" />
      </div>

      <h2 className="font-brand text-4xl text-fluno-ink mb-3">
        {category === "All"
          ? "Great content coming soon"
          : `No ${category} posts yet`}
      </h2>
      <p className="font-body text-fluno-muted max-w-sm leading-relaxed">
        We&apos;re crafting science-backed skincare insights for Indian skin.
        Check back soon for expert articles, routine guides, and ingredient
        deep-dives.
      </p>

      {category !== "All" && (
        <Link href="/blog" className="btn-outline mt-8">
          View all posts
        </Link>
      )}
    </div>
  );
}
