import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { ProductModel } from "@/lib/models/Product";

export const dynamic = "force-dynamic";

// Google Merchant Center product feed (RSS 2.0 + g: namespace).
// Submit https://www.myfluno.com/api/merchant-feed in Merchant Center
// to get free product listings in the Google Shopping tab.
export async function GET() {
  await connectDB();
  const products = await ProductModel.find({ active: true }).lean() as {
    _id: unknown; slug: string; name: string; tagline?: string; description?: string;
    price: number; images?: string[]; inStock?: boolean; category?: string; size?: string;
  }[];

  const esc = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

  const items = products.map((p) => `
    <item>
      <g:id>${esc(p.slug)}</g:id>
      <g:title>${esc(p.name)}${p.size ? esc(` — ${p.size}`) : ""}</g:title>
      <g:description>${esc(p.description || p.tagline || p.name)}</g:description>
      <g:link>https://www.myfluno.com/product/${esc(p.slug)}</g:link>
      ${p.images?.[0] ? `<g:image_link>${esc(p.images[0])}</g:image_link>` : ""}
      ${(p.images ?? []).slice(1, 10).map((img) => `<g:additional_image_link>${esc(img)}</g:additional_image_link>`).join("\n      ")}
      <g:availability>${p.inStock === false ? "out_of_stock" : "in_stock"}</g:availability>
      <g:price>${p.price}.00 INR</g:price>
      <g:brand>Fluno</g:brand>
      <g:condition>new</g:condition>
      <g:identifier_exists>false</g:identifier_exists>
      <g:google_product_category>Health &amp; Beauty &gt; Personal Care</g:google_product_category>
      ${p.category ? `<g:product_type>${esc(p.category)}</g:product_type>` : ""}
    </item>`).join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Fluno — Care in Every Drop</title>
    <link>https://www.myfluno.com</link>
    <description>Mid-premium personal care and hygiene products from India.</description>
    ${items}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
