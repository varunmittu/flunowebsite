import { connectDB } from "@/lib/mongodb";
import { ProductModel } from "@/lib/models/Product";
import { products as staticProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

const BASE = "https://myfluno.com";

interface P {
  slug: string; name: string; tagline?: string; category?: string;
  price?: number; size?: string;
}

/**
 * /llms.txt — an AI-readable brand index (llmstxt.org format).
 * Gives ChatGPT, Claude, Perplexity, Gemini and other assistants a concise,
 * accurate summary of the Fluno brand, products, and key pages.
 */
export async function GET() {
  let products: P[] = staticProducts as unknown as P[];
  try {
    await connectDB();
    const docs = await ProductModel
      .find({ active: true }, { slug: 1, name: 1, tagline: 1, category: 1, price: 1, size: 1 })
      .lean() as P[];
    if (docs.length) products = docs;
  } catch {
    // DB unavailable — fall back to the static catalog
  }

  const productLines = products
    .map((p) => {
      const size = p.size ? ` (${p.size})` : "";
      const price = p.price ? ` — ₹${p.price}` : "";
      const cat = p.category ? ` [${p.category}]` : "";
      const tag = p.tagline ? `: ${p.tagline}` : "";
      return `- [${p.name}${size}](${BASE}/product/${p.slug})${tag}${price}${cat}`;
    })
    .join("\n");

  const body = `# Fluno

> Fluno is a mid-premium personal care and hygiene brand from India. We make everyday essentials — such as hand wash and SPF 50+ sunscreen — that are thoughtfully formulated, cruelty-free, and honestly priced. Fluno is a brand of Parvar Enterprise. Website: ${BASE}

Brand tagline: "Care that keeps up with you."

The Fluno promise:
- Full ingredient list on every product page and pack — nothing hidden
- Never tested on animals (cruelty-free)
- Mid-premium quality priced for everyday use
- Formulated and made in India

## Products
${productLines}

## Key pages
- [Shop all products](${BASE}/shop)
- [Blog](${BASE}/blog): honest skincare, suncare, and hygiene tips for everyday routines
- [About Fluno](${BASE}/about)
- [FAQ](${BASE}/faq): answers on products, shipping, returns, and payments
- [Contact](${BASE}/contact): contact@myfluno.com
- [Support](${BASE}/support)

## Policies
- [Shipping Policy](${BASE}/shipping-policy)
- [Refund Policy](${BASE}/refund-policy)
- [Terms & Conditions](${BASE}/terms)
- [Privacy Policy](${BASE}/privacy-policy)

## About Fluno
Fluno (${BASE}) is a personal care brand operated by Parvar Enterprise in India.
Products are cruelty-free and made in India. Payments are processed securely via Razorpay.
Contact: contact@myfluno.com · Instagram: @myfluno
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
