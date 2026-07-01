import type { Metadata } from "next";
import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import { BlogModel } from "@/lib/models/Blog";
import { Calendar, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog",
  description: "Skin care tips, ingredient deep-dives, and honest advice from the Fluno team.",
};

interface Post {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  coverImage?: string;
  category?: string;
  author?: string;
  readTime?: string;
  createdAt: string;
}

async function getPosts(): Promise<Post[]> {
  try {
    await connectDB();
    const posts = await BlogModel
      .find({ published: true })
      .sort({ createdAt: -1 })
      .lean();
    return JSON.parse(JSON.stringify(posts));
  } catch {
    return [];
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric",
  });
}

export default async function BlogPage() {
  const posts = await getPosts();
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

      {posts.length === 0 ? (
        <div className="card p-16 text-center">
          <p className="font-display text-2xl text-fluno-ink mb-3">Coming soon</p>
          <p className="font-body text-fluno-ink/50">
            We&apos;re working on some great content. Check back soon.
          </p>
        </div>
      ) : (
        <>
          {/* Featured Post */}
          <Link href={`/blog/${featured.slug}`} className="block group mb-14">
            <div className="grid lg:grid-cols-2 gap-0 card overflow-hidden">
              <div className="aspect-[4/3] lg:aspect-auto relative overflow-hidden bg-fluno-stone/20">
                {featured.coverImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={featured.coverImage}
                    alt={featured.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full min-h-[280px] bg-gradient-to-br from-fluno-purple/10 to-fluno-teal/10 flex items-center justify-center">
                    <span className="font-mono text-xs text-fluno-ink/30 uppercase tracking-widest">No image</span>
                  </div>
                )}
              </div>
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                {featured.category && <span className="badge mb-4">{featured.category}</span>}
                <h2 className="font-display text-3xl text-fluno-ink group-hover:text-fluno-teal transition-colors leading-tight">
                  {featured.title}
                </h2>
                {featured.excerpt && (
                  <p className="font-body text-fluno-ink/60 mt-4 leading-relaxed">{featured.excerpt}</p>
                )}
                <div className="flex items-center gap-3 mt-6 font-mono text-xs text-fluno-ink/40">
                  <span className="flex items-center gap-1"><Calendar size={11} />{formatDate(featured.createdAt)}</span>
                  {featured.readTime && <><span>·</span><span className="flex items-center gap-1"><Clock size={11} />{featured.readTime}</span></>}
                </div>
              </div>
            </div>
          </Link>

          {/* Post Grid */}
          {rest.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {rest.map((post) => (
                <Link key={post._id} href={`/blog/${post.slug}`} className="card group overflow-hidden">
                  <div className="aspect-[16/9] relative overflow-hidden bg-fluno-stone/20">
                    {post.coverImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-fluno-purple/10 to-fluno-teal/10" />
                    )}
                  </div>
                  <div className="p-5">
                    {post.category && <span className="badge mb-3 block w-fit">{post.category}</span>}
                    <h3 className="font-display text-lg text-fluno-ink group-hover:text-fluno-teal transition-colors leading-snug">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="font-body text-sm text-fluno-ink/60 mt-2 leading-relaxed line-clamp-2">{post.excerpt}</p>
                    )}
                    <div className="flex items-center gap-3 mt-4 font-mono text-xs text-fluno-ink/40">
                      <span>{formatDate(post.createdAt)}</span>
                      {post.readTime && <><span>·</span><span>{post.readTime}</span></>}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
