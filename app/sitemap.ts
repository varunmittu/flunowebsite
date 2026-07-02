import { MetadataRoute } from "next";
import { connectDB } from "@/lib/mongodb";
import { ProductModel } from "@/lib/models/Product";
import { BlogModel } from "@/lib/models/Blog";

const BASE = "https://myfluno.com";

const staticRoutes: MetadataRoute.Sitemap = [
  { url: BASE,                           lastModified: new Date(), changeFrequency: "weekly",  priority: 1.0 },
  { url: `${BASE}/shop`,                 lastModified: new Date(), changeFrequency: "daily",   priority: 0.9 },
  { url: `${BASE}/blog`,                 lastModified: new Date(), changeFrequency: "daily",   priority: 0.8 },
  { url: `${BASE}/about`,                lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  { url: `${BASE}/contact`,              lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  { url: `${BASE}/support`,              lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  { url: `${BASE}/faq`,                  lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  { url: `${BASE}/wishlist`,             lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
  { url: `${BASE}/terms`,                lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
  { url: `${BASE}/privacy-policy`,       lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
  { url: `${BASE}/refund-policy`,        lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
  { url: `${BASE}/shipping-policy`,      lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let productEntries: MetadataRoute.Sitemap = [];
  let blogEntries:    MetadataRoute.Sitemap = [];

  try {
    await connectDB();

    const products = await ProductModel
      .find({ active: true }, { slug: 1, updatedAt: 1 })
      .lean() as { slug: string; updatedAt?: Date }[];

    productEntries = products.map((p) => ({
      url:             `${BASE}/product/${p.slug}`,
      lastModified:    p.updatedAt ?? new Date(),
      changeFrequency: "weekly" as const,
      priority:        0.85,
    }));

    const blogs = await BlogModel
      .find({ published: true }, { slug: 1, updatedAt: 1 })
      .lean() as { slug: string; updatedAt?: Date }[];

    blogEntries = blogs.map((b) => ({
      url:             `${BASE}/blog/${b.slug}`,
      lastModified:    b.updatedAt ?? new Date(),
      changeFrequency: "monthly" as const,
      priority:        0.65,
    }));
  } catch {
    // DB unavailable at build time — return static routes only
  }

  return [...staticRoutes, ...productEntries, ...blogEntries];
}
