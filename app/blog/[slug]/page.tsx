import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Clock, User, Calendar, Tag } from "lucide-react";
import { connectDB } from "@/lib/mongodb";
import { BlogModel } from "@/lib/models/Blog";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

/* ─── Types ──────────────────────────────────────────────────────────── */

interface Post {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  coverImage?: string;
  category?: string;
  author?: string;
  readTime?: string;
  images?: string[];
  tags?: string[];
  createdAt: string;
}

/* ─── Data helpers ───────────────────────────────────────────────────── */

async function getPost(slug: string): Promise<Post | null> {
  try {
    await connectDB();
    const post = await BlogModel.findOne({ slug, published: true }).lean();
    if (!post) return null;
    return JSON.parse(JSON.stringify(post));
  } catch {
    return null;
  }
}

async function getRelated(category: string, currentSlug: string): Promise<Post[]> {
  try {
    await connectDB();
    const posts = await BlogModel.find({
      category,
      slug: { $ne: currentSlug },
      published: true,
    })
      .sort({ createdAt: -1 })
      .limit(3)
      .lean();
    return JSON.parse(JSON.stringify(posts));
  } catch {
    return [];
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/* ─── Metadata ───────────────────────────────────────────────────────── */

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) return {};
  return {
    title: `${post.title} — Fluno Blog`,
    description:
      post.excerpt ??
      post.content?.replace(/<[^>]+>/g, "").slice(0, 160),
    openGraph: {
      images: post.coverImage ? [{ url: post.coverImage }] : [],
    },
  };
}

/* ─── Page ───────────────────────────────────────────────────────────── */

export default async function BlogPost({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPost(params.slug);
  if (!post) notFound();

  const related = post.category
    ? await getRelated(post.category, post.slug)
    : [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt ?? "",
    image: post.coverImage ? [post.coverImage] : [],
    datePublished: post.createdAt,
    author: { "@type": "Organization", name: post.author ?? "Fluno Team" },
    publisher: { "@type": "Organization", name: "Fluno", url: "https://myfluno.com" },
    mainEntityOfPage: `https://myfluno.com/blog/${post.slug}`,
  };

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* ── Editorial hero ────────────────────────────────────────────── */}
      <div className="relative w-full min-h-[55vh] md:min-h-[65vh] bg-fig-navy flex items-end overflow-hidden">
        {/* Background image */}
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            priority
            className="object-cover opacity-45"
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-fig-navy via-fig-navy to-fig-terracotta-deep/40" />
        )}

        {/* Gradient veil — fades image into solid dark at bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-fig-navy via-fig-navy/55 to-transparent" />

        {/* Title block */}
        <div className="relative z-10 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-12 md:pb-18">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-fig-body text-white/45
                       hover:text-fig-mustard transition-colors mb-7"
          >
            <ArrowLeft size={14} /> Back to Blog
          </Link>

          {post.category && (
            <div className="mb-4">
              <span className="fig-fig-badge">{post.category}</span>
            </div>
          )}

          <h1 className="font-fig font-bold text-4xl md:text-6xl text-white leading-[1.08] max-w-3xl">
            {post.title}
          </h1>
        </div>
      </div>

      {/* ── Metadata bar ──────────────────────────────────────────────── */}
      <div className="bg-fig-navy/95 border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap gap-5 items-center">
          <span className="flex items-center gap-1.5 font-fig-body text-xs text-white/40">
            <User size={12} />
            {post.author ?? "Fluno Team"}
          </span>
          <span className="flex items-center gap-1.5 font-fig-body text-xs text-white/40">
            <Calendar size={12} />
            {formatDate(post.createdAt)}
          </span>
          {post.readTime && (
            <span className="flex items-center gap-1.5 font-fig-body text-xs text-white/40">
              <Clock size={12} />
              {post.readTime}
            </span>
          )}
        </div>
      </div>

      {/* ── Article body ──────────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">

        {/* Pull-quote excerpt */}
        {post.excerpt && (
          <p className="font-fig font-bold text-xl text-fig-navy/70 leading-relaxed mb-10
                        border-l-4 border-fig-terracotta pl-5">
            {post.excerpt}
          </p>
        )}

        {/* Rendered HTML content */}
        {post.content && (
          <div
            className="
              prose prose-lg max-w-none
              prose-headings:font-fig font-bold prose-headings:text-fig-navy prose-headings:font-bold prose-headings:leading-snug
              prose-p:font-fig-body prose-p:text-fig-navy/75 prose-p:leading-relaxed
              prose-a:text-fig-terracotta prose-a:no-underline hover:prose-a:underline
              prose-strong:text-fig-navy prose-strong:font-semibold
              prose-li:font-fig-body prose-li:text-fig-navy/75
              prose-img:rounded-2xl prose-img:shadow-lg
              prose-blockquote:border-l-4 prose-blockquote:border-fig-terracotta
              prose-blockquote:bg-fig-sage/30 prose-blockquote:rounded-r-2xl
              prose-blockquote:py-2 prose-blockquote:pr-5 prose-blockquote:not-italic
              prose-code:text-fig-terracotta prose-code:bg-fig-sage/40
              prose-code:rounded prose-code:px-1.5 prose-code:py-0.5 prose-code:font-fig-body
              prose-hr:border-fig-sage
            "
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        )}

        {/* ── In-article image gallery ─────────────────────────────── */}
        {post.images && post.images.length > 0 && (
          <div className="mt-16">
            <h2 className="font-fig font-bold text-xl font-bold text-fig-navy mb-6">
              Gallery
            </h2>
            <div
              className={`grid gap-4 ${
                post.images.length === 1
                  ? "grid-cols-1"
                  : post.images.length === 2
                  ? "grid-cols-2"
                  : "grid-cols-3"
              }`}
            >
              {post.images.map((src, i) => (
                <div
                  key={i}
                  className="relative aspect-square rounded-2xl overflow-hidden
                             bg-fig-sage/40 shadow-md"
                >
                  <Image
                    src={src}
                    alt={`${post.title} — image ${i + 1}`}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Tags ─────────────────────────────────────────────────── */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-12 flex flex-wrap gap-2 items-center">
            <Tag size={14} className="text-fig-ink-soft shrink-0" />
            {post.tags.map((tag) => (
              <span key={tag} className="fig-badge">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* ── Shop CTA ─────────────────────────────────────────────── */}
        <div className="mt-20 rounded-3xl bg-gradient-to-br from-fig-navy to-fig-navy
                        p-10 md:p-14 text-center relative overflow-hidden">
          {/* Ambient orbs */}
          <div
            aria-hidden
            className="absolute -top-24 -right-24 w-72 h-72 rounded-full
                       bg-fig-terracotta/20 blur-[90px] pointer-events-none"
          />
          <div
            aria-hidden
            className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full
                       bg-fig-mustard/10 blur-[70px] pointer-events-none"
          />
          <div className="relative z-10">
            <p className="fig-eyebrow text-fig-mustard/60 mb-4">Made for Indian skin</p>
            <h2 className="font-fig font-bold text-3xl md:text-4xl text-white mb-3">
              Ready to glow?
            </h2>
            <p className="font-fig-body text-white/45 mb-8 max-w-sm mx-auto leading-relaxed">
              Explore our science-backed skincare range crafted specifically for
              Indian skin types and climates.
            </p>
            <Link href="/shop" className="fig-btn">
              Shop Fluno Products →
            </Link>
          </div>
        </div>
      </div>

      {/* ── Related articles ──────────────────────────────────────────── */}
      {related.length > 0 && (
        <section className="bg-fig-sage/25 py-16 border-t border-fig-sage/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-fig font-bold text-2xl font-bold text-fig-navy mb-8">
              Related Articles
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((rel) => (
                <Link
                  key={rel._id}
                  href={`/blog/${rel.slug}`}
                  className="bg-fig-paper border border-fig-navy/10 rounded-2xl group"
                >
                  {/* Cover */}
                  <div className="relative aspect-[16/9] overflow-hidden bg-fig-sage/40">
                    {rel.coverImage ? (
                      <Image
                        src={rel.coverImage}
                        alt={rel.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-fig-terracotta/20 to-fig-mustard/20" />
                    )}
                  </div>
                  {/* Info */}
                  <div className="p-5">
                    {rel.category && (
                      <span className="fig-badge mb-2 block w-fit">
                        {rel.category}
                      </span>
                    )}
                    <h3 className="font-fig font-bold text-fig-navy group-hover:text-fig-terracotta
                                   transition-colors leading-snug line-clamp-2">
                      {rel.title}
                    </h3>
                    {rel.readTime && (
                      <span className="flex items-center gap-1.5 mt-3 font-fig-body text-xs text-fig-ink-soft">
                        <Clock size={11} />
                        {rel.readTime}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
