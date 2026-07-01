import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
import { connectDB } from "@/lib/mongodb";
import { BlogModel } from "@/lib/models/Blog";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

interface Post {
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  coverImage?: string;
  category?: string;
  author?: string;
  readTime?: string;
  createdAt: string;
}

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

export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt ?? post.content?.slice(0, 160),
  };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric",
  });
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  if (!post) notFound();

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/blog"
        className="flex items-center gap-2 text-sm font-body text-fluno-ink/40 hover:text-fluno-teal mb-8 transition-colors"
      >
        <ArrowLeft size={14} /> Back to Blog
      </Link>

      {post.category && <span className="badge mb-4 block w-fit">{post.category}</span>}
      <h1 className="font-display text-4xl md:text-5xl text-fluno-ink leading-tight">
        {post.title}
      </h1>

      <div className="flex flex-wrap items-center gap-4 mt-4 font-mono text-sm text-fluno-ink/40">
        <span className="flex items-center gap-1.5"><Calendar size={13} />{formatDate(post.createdAt)}</span>
        {post.readTime && <span className="flex items-center gap-1.5"><Clock size={13} />{post.readTime}</span>}
        <span className="flex items-center gap-1.5"><User size={13} />{post.author ?? "Fluno Team"}</span>
      </div>

      {post.coverImage && (
        <div className="mt-8 aspect-[16/9] relative rounded-sm overflow-hidden bg-fluno-stone/20">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {post.content && (
        <div
          className="mt-10 prose prose-lg max-w-none font-body text-fluno-ink/80 leading-relaxed
            prose-headings:font-display prose-headings:text-fluno-ink
            prose-a:text-fluno-teal prose-strong:text-fluno-ink"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      )}

      <div className="mt-12 pt-8 border-t border-fluno-stone/40">
        <p className="font-display text-xl text-fluno-ink mb-2">
          Try the products behind the science.
        </p>
        <Link href="/shop" className="btn-primary mt-4 inline-flex">
          Shop Fluno
        </Link>
      </div>
    </article>
  );
}
