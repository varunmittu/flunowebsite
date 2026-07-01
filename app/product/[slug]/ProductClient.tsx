"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Star, ShieldCheck, ChevronDown, ChevronUp, ArrowLeft,
  Heart, Share2, MessageSquare, CheckCircle2, Loader2, AlertCircle,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useSession } from "next-auth/react";

interface Product {
  id: string; slug: string; name: string; tagline: string; price: number;
  originalPrice?: number; size: string; category: string; rating: number;
  reviewCount: number; images: string[]; description: string;
  ingredients: string[]; howToUse: string[]; benefits: string[]; badges: string[];
  inStock: boolean;
}

interface Review {
  _id: string;
  name: string;
  rating: number;
  title?: string;
  comment: string;
  verified: boolean;
  createdAt: string;
}

function StarRow({ value, onChange, size = 20 }: { value: number; onChange?: (v: number) => void; size?: number }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onChange?.(s)}
          onMouseEnter={() => onChange && setHover(s)}
          onMouseLeave={() => onChange && setHover(0)}
          className={onChange ? "cursor-pointer" : "cursor-default"}
        >
          <Star
            size={size}
            className={
              s <= (hover || value)
                ? "text-amber-400 fill-amber-400"
                : "text-fluno-lavender fill-none"
            }
          />
        </button>
      ))}
    </div>
  );
}

function ShareButtons({ product }: { product: Product }) {
  const [copied, setCopied] = useState(false);

  const url = typeof window !== "undefined"
    ? `${window.location.origin}/product/${product.slug}`
    : `https://myfluno.com/product/${product.slug}`;

  const text = `Check out ${product.name} on Fluno — ₹${product.price}`;

  const whatsapp = `https://wa.me/?text=${encodeURIComponent(text + "\n" + url)}`;
  const twitter  = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;

  function copyLink() {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-xs text-fluno-muted flex items-center gap-1"><Share2 size={12} /> Share:</span>
      <a
        href={whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-green-50 hover:bg-green-100 text-green-700 text-xs font-body transition-colors"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.555 4.122 1.527 5.854L.057 24l6.307-1.654A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.808 9.808 0 01-5.003-1.371l-.359-.214-3.738.979 1.002-3.651-.233-.376A9.791 9.791 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182c5.43 0 9.818 4.388 9.818 9.818 0 5.43-4.388 9.818-9.818 9.818z"/>
        </svg>
        WhatsApp
      </a>
      <a
        href={twitter}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-body transition-colors"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
        X
      </a>
      <button
        onClick={copyLink}
        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-fluno-lavender/40 hover:bg-fluno-lavender text-fluno-ink text-xs font-body transition-colors"
      >
        {copied ? <><CheckCircle2 size={12} className="text-green-600" /> Copied!</> : "Copy Link"}
      </button>
    </div>
  );
}

function LikeButton({ productSlug }: { productSlug: string }) {
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("fluno_likes") ?? "[]";
    const list: string[] = JSON.parse(saved);
    setLiked(list.includes(productSlug));
  }, [productSlug]);

  function toggle() {
    const saved = localStorage.getItem("fluno_likes") ?? "[]";
    const list: string[] = JSON.parse(saved);
    const next = liked
      ? list.filter((s) => s !== productSlug)
      : [...list, productSlug];
    localStorage.setItem("fluno_likes", JSON.stringify(next));
    setLiked(!liked);
  }

  return (
    <button
      onClick={toggle}
      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border transition-all ${
        liked
          ? "border-red-300 bg-red-50 text-red-500"
          : "border-fluno-lavender/40 text-fluno-muted hover:border-red-300 hover:text-red-400"
      }`}
    >
      <Heart size={16} className={liked ? "fill-current" : ""} />
      <span className="text-xs font-body">{liked ? "Saved" : "Wishlist"}</span>
    </button>
  );
}

function ReviewsSection({ product }: { product: Product }) {
  const { data: session } = useSession();
  const [reviews, setReviews]   = useState<Review[]>([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitOk, setSubmitOk]   = useState(false);
  const [form, setForm] = useState({
    name: (session?.user?.name ?? "") as string,
    email: (session?.user?.email ?? "") as string,
    rating: 0,
    title: "",
    comment: "",
  });

  useEffect(() => {
    fetch(`/api/reviews?slug=${product.slug}`)
      .then((r) => r.json())
      .then((d) => setReviews(d.reviews ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [product.slug]);

  useEffect(() => {
    if (session?.user) {
      setForm((f) => ({
        ...f,
        name: (session.user?.name ?? f.name) as string,
        email: (session.user?.email ?? f.email) as string,
      }));
    }
  }, [session]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.rating) { setSubmitError("Please select a rating"); return; }
    setSubmitting(true);
    setSubmitError("");
    try {
      const res  = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, productId: product.id, productSlug: product.slug }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed");
      setReviews((prev) => [data.review, ...prev]);
      setSubmitOk(true);
      setShowForm(false);
      setForm((f) => ({ ...f, rating: 0, title: "", comment: "" }));
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  }

  const avgRating = reviews.length
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : product.rating;

  return (
    <section className="mt-16">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <MessageSquare size={20} className="text-fluno-purple" />
          <h2 className="font-display text-2xl text-fluno-ink">
            Reviews ({reviews.length || product.reviewCount})
          </h2>
          {reviews.length > 0 && (
            <div className="flex items-center gap-1">
              <StarRow value={Math.round(avgRating)} size={14} />
              <span className="font-mono text-xs text-fluno-muted">{avgRating.toFixed(1)}</span>
            </div>
          )}
        </div>
        {!showForm && !submitOk && (
          <button
            onClick={() => setShowForm(true)}
            className="btn-outline text-sm"
          >
            Write a Review
          </button>
        )}
      </div>

      {submitOk && (
        <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl p-3 mb-5">
          <CheckCircle2 size={16} /> Thank you! Your review has been submitted.
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="card p-6 mb-8 space-y-4">
          <h3 className="font-display text-lg text-fluno-ink">Write a Review</h3>

          {submitError && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
              <AlertCircle size={15} /> {submitError}
            </div>
          )}

          <div>
            <label className="block font-mono text-xs text-fluno-ink/40 mb-2 uppercase tracking-wide">Your Rating *</label>
            <StarRow value={form.rating} onChange={(v) => setForm((f) => ({ ...f, rating: v }))} size={24} />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-xs text-fluno-ink/40 mb-1.5 uppercase tracking-wide">Name *</label>
              <input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                required
                placeholder="Your name"
                className="input w-full"
              />
            </div>
            <div>
              <label className="block font-mono text-xs text-fluno-ink/40 mb-1.5 uppercase tracking-wide">Email *</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                required
                placeholder="you@example.com"
                className="input w-full"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono text-xs text-fluno-ink/40 mb-1.5 uppercase tracking-wide">Title</label>
            <input
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="Summary of your review"
              className="input w-full"
            />
          </div>

          <div>
            <label className="block font-mono text-xs text-fluno-ink/40 mb-1.5 uppercase tracking-wide">Review *</label>
            <textarea
              value={form.comment}
              onChange={(e) => setForm((f) => ({ ...f, comment: e.target.value }))}
              required
              rows={4}
              placeholder="Share your experience with this product..."
              className="input w-full resize-none"
            />
          </div>

          <div className="flex gap-3">
            <button type="submit" disabled={submitting} className="btn-primary">
              {submitting ? <><Loader2 size={14} className="animate-spin" /> Submitting…</> : "Submit Review"}
            </button>
            <button
              type="button"
              onClick={() => { setShowForm(false); setSubmitError(""); }}
              className="btn-outline"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center py-8"><Loader2 size={24} className="animate-spin text-fluno-purple" /></div>
      ) : reviews.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="font-body text-fluno-ink/40">No reviews yet. Be the first to review this product!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r._id} className="card p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-fluno-purple/10 flex items-center justify-center flex-shrink-0">
                    <span className="font-brand font-bold text-sm text-fluno-purple">
                      {r.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-body text-sm font-medium text-fluno-ink flex items-center gap-1.5">
                      {r.name}
                      {r.verified && (
                        <span className="flex items-center gap-0.5 text-[10px] font-mono text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                          <CheckCircle2 size={9} /> Verified
                        </span>
                      )}
                    </p>
                    <StarRow value={r.rating} size={12} />
                  </div>
                </div>
                <p className="font-mono text-xs text-fluno-ink/30">
                  {new Date(r.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </div>
              {r.title && <p className="font-body text-sm font-semibold text-fluno-ink mt-3">{r.title}</p>}
              <p className="font-body text-sm text-fluno-ink/70 mt-2 leading-relaxed">{r.comment}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default function ProductClient({ product, related }: { product: Product; related: Product[] }) {
  const { addItem } = useCart();
  const [activeImage, setActiveImage] = useState(0);
  const [openSection, setOpenSection] = useState<string | null>("ingredients");
  const [qty, setQty] = useState(1);

  function toggle(section: string) { setOpenSection(openSection === section ? null : section); }

  function handleAdd() {
    for (let i = 0; i < qty; i++) {
      addItem({ id: product.id, slug: product.slug, name: product.name, price: product.price, size: product.size, image: product.images[0] });
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <nav className="flex items-center gap-2 text-sm text-fluno-ink/40 mb-8 font-body">
        <Link href="/shop" className="flex items-center gap-1 hover:text-fluno-purple"><ArrowLeft size={14} /> Shop</Link>
        <span>/</span>
        <span className="text-fluno-ink">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Gallery */}
        <div>
          <div className="aspect-square rounded-2xl overflow-hidden bg-fluno-lavender/30 relative">
            <Image src={product.images[activeImage]} alt={product.name} fill priority className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-3 mt-4">
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setActiveImage(i)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${activeImage === i ? "border-fluno-purple" : "border-fluno-lavender/40 hover:border-fluno-purple/50"}`}>
                  <Image src={img} alt={`${product.name} view ${i + 1}`} width={80} height={80} className="object-cover w-full h-full" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <div className="flex flex-wrap gap-2 mb-4">
            {product.badges.map((b) => <span key={b} className="badge">{b}</span>)}
          </div>

          <h1 className="font-display text-3xl md:text-4xl text-fluno-ink leading-tight">{product.name}</h1>
          <p className="font-body text-fluno-muted mt-2">{product.tagline}</p>

          <div className="flex items-center gap-2 mt-4">
            <StarRow value={Math.floor(product.rating)} size={16} />
            <span className="font-mono text-sm text-fluno-muted">{product.rating} ({product.reviewCount} reviews)</span>
          </div>

          <div className="flex items-baseline gap-3 mt-6">
            <span className="font-display text-4xl text-fluno-purple font-semibold">₹{product.price}</span>
            {product.originalPrice && <span className="font-mono text-lg text-fluno-muted line-through">₹{product.originalPrice}</span>}
            <span className="font-mono text-sm text-fluno-muted">{product.size}</span>
          </div>

          <p className="font-body text-fluno-ink/70 mt-5 leading-relaxed">{product.description}</p>

          <ul className="mt-5 space-y-2">
            {product.benefits.map((b) => (
              <li key={b} className="flex items-center gap-2 text-sm font-body text-fluno-ink/70">
                <ShieldCheck size={14} className="text-fluno-purple flex-shrink-0" />{b}
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3 mt-8">
            <div className="flex items-center border border-fluno-lavender rounded-xl overflow-hidden">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-3 text-fluno-muted hover:text-fluno-purple hover:bg-fluno-lavender/30 transition-colors">−</button>
              <span className="px-4 font-mono text-sm">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="px-3 py-3 text-fluno-muted hover:text-fluno-purple hover:bg-fluno-lavender/30 transition-colors">+</button>
            </div>
            <button onClick={handleAdd} disabled={!product.inStock} className="btn-primary flex-1">
              {product.inStock ? "Add to Cart" : "Out of Stock"}
            </button>
            <LikeButton productSlug={product.slug} />
          </div>

          {/* Share */}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <ShareButtons product={product} />
          </div>

          <div className="mt-5 p-4 bg-fluno-purple/5 border border-fluno-purple/20 rounded-2xl flex items-start gap-3">
            <ShieldCheck size={18} className="text-fluno-purple mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-body text-sm font-medium text-fluno-purple">Ingredient Safety Verified</p>
              <p className="font-mono text-xs text-fluno-muted mt-0.5">Formulated against EU/UK ingredient-safety standards</p>
            </div>
          </div>

          <div className="mt-8 space-y-2">
            {[
              { key: "ingredients", label: "Ingredients (INCI)", content: product.ingredients.join(", ") },
              { key: "howto", label: "How to Use", content: "" },
            ].map(({ key, label }) => (
              <div key={key} className="border border-fluno-lavender/40 rounded-xl overflow-hidden">
                <button onClick={() => toggle(key)} className="w-full flex items-center justify-between px-4 py-3.5 text-left font-body text-sm font-medium text-fluno-ink hover:bg-fluno-lavender/20 transition-colors">
                  {label}
                  {openSection === key ? <ChevronUp size={16} className="text-fluno-purple" /> : <ChevronDown size={16} className="text-fluno-muted" />}
                </button>
                {openSection === key && (
                  <div className="px-4 pb-4 pt-1">
                    {key === "ingredients" ? (
                      <p className="font-mono text-xs text-fluno-muted leading-relaxed">{product.ingredients.join(", ")}</p>
                    ) : (
                      <ol className="space-y-1">
                        {product.howToUse.map((step, i) => (
                          <li key={i} className="font-body text-sm text-fluno-ink/70 flex gap-2">
                            <span className="font-mono text-fluno-purple text-xs mt-0.5 w-4 flex-shrink-0">{i + 1}.</span>
                            {step}
                          </li>
                        ))}
                      </ol>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <ReviewsSection product={product} />

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="section-title mb-8">You Might Also Like</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {related.map((p) => (
              <Link key={p.id} href={`/product/${p.slug}`} className="card p-4 flex gap-4 items-center hover:shadow-md transition-shadow">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-fluno-lavender/30 flex-shrink-0 relative">
                  <Image src={p.images[0]} alt={p.name} fill className="object-cover" />
                </div>
                <div>
                  <p className="font-display text-sm text-fluno-ink">{p.name}</p>
                  <p className="font-mono text-xs text-fluno-muted">{p.size}</p>
                  <p className="font-display text-fluno-purple text-sm font-medium mt-1">₹{p.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
