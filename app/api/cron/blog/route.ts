import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { google } from "googleapis";
import { Readable } from "stream";
import { connectDB } from "@/lib/mongodb";
import { BlogModel } from "@/lib/models/Blog";
import { ConfigModel } from "@/lib/models/Config";

export const runtime  = "nodejs";
export const dynamic  = "force-dynamic";
export const maxDuration = 60;

// ── Topic pool (rotates daily by day-of-year) ──────────────────────────────
const TOPICS = [
  "Why SPF 50 Sunscreen Is Essential for Indian Skin Types",
  "Building a Simple Morning Skincare Routine That Actually Works",
  "Niacinamide: The Ingredient Your Skin Has Been Waiting For",
  "Hand Wash vs Hand Sanitiser: What the Science Says",
  "How to Choose the Right Moisturiser for Your Skin Type",
  "Hyaluronic Acid Explained: Does It Really Hydrate Your Skin",
  "5 Skincare Myths That Are Hurting Your Skin",
  "Why pH Balance Matters More Than Any Skincare Product",
  "Clean Beauty: What the Label Really Means",
  "How to Layer Skincare Products in the Right Order",
  "Vitamin C Serums: Benefits, Usage and What to Avoid",
  "Chemical vs Mineral Sunscreen: Which Is Better for You",
  "Skincare Routine Adjustments for Monsoon Season in India",
  "The Complete Guide to Caring for Sensitive Skin",
  "Why Hand Hygiene Is Your First Line of Defence",
  "What Is the Skin Barrier and How Do You Repair It",
  "Skincare for Men: A No-Nonsense Beginner's Guide",
  "Dealing with Uneven Skin Tone: What Works and What Doesn't",
  "How to Keep Skin Hydrated Through the Indian Summer",
  "Retinol Basics: A Gentle Introduction for First-Time Users",
  "The Truth About Sunscreen and Dark Skin Tones",
  "How Hard Water Affects Your Skin and Hair",
  "Under-Eye Care: What Actually Helps Reduce Puffiness",
  "The Role of Diet in Healthy Skin: What Research Says",
  "Why Your Skincare Routine Needs to Change With the Seasons",
];

// ── Drive upload ───────────────────────────────────────────────────────────
async function uploadBase64ToDrive(
  imageBase64: string,
  fileName: string
): Promise<string | null> {
  try {
    await connectDB();
    const config = await ConfigModel.findOne({ key: "google_drive_refresh_token" });
    if (!config?.value) return null;

    const oauth2 = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      "https://www.myfluno.com/api/admin/drive/callback"
    );
    oauth2.setCredentials({ refresh_token: config.value });
    const drive = google.drive({ version: "v3", auth: oauth2 });

    const buffer = Buffer.from(imageBase64, "base64");
    const stream = Readable.from(buffer);
    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

    const uploaded = await drive.files.create({
      requestBody: {
        name: fileName,
        ...(folderId ? { parents: [folderId] } : {}),
      },
      media: { mimeType: "image/jpeg", body: stream },
      fields: "id",
    });

    const fileId = uploaded.data.id!;
    await drive.permissions.create({
      fileId,
      requestBody: { role: "reader", type: "anyone" },
    });

    return `https://lh3.googleusercontent.com/d/${fileId}`;
  } catch (err) {
    console.error("Drive upload failed:", err instanceof Error ? err.message : err);
    return null;
  }
}

// ── Slug helper ────────────────────────────────────────────────────────────
function toSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);
}

// ── Main handler ───────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  // Vercel cron sends: Authorization: Bearer <CRON_SECRET>
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "GEMINI_API_KEY not set" }, { status: 500 });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    // ── Pick today's topic ────────────────────────────────────────────────
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
    );
    const topic = TOPICS[dayOfYear % TOPICS.length];

    // ── Generate blog content + image prompts ─────────────────────────────
    const blogPrompt = `You are a professional content writer for Fluno — a mid-premium personal care and hygiene brand from Hyderabad, India. Fluno's products include sunscreens, hand wash, and skincare formulated against EU/UK safety standards.

Write a complete SEO-optimised blog post on the topic: "${topic}"

LEGAL AND BRAND RULES (strictly follow):
- Never use words like "cures", "treats", "heals", "prevents disease" — these are medical claims
- Use phrases like "may help", "is commonly used to", "many people find", "skincare experts suggest"
- Add a short disclaimer at the end: "This article is for informational purposes only. Consult a certified dermatologist before changing your skincare routine."
- Do not compare or disparage competitor brands by name
- No offensive, harmful or misleading content
- Write in a warm, honest, educational tone — not salesy
- Mention Fluno naturally 1–2 times only (e.g. "Fluno's formulas follow EU-standard ingredient safety")
- Target Indian readers: reference Indian climate, skin tones, and seasonal conditions where relevant
- Content must be factually accurate

Return ONLY a valid JSON object with this exact schema (no markdown, no extra text):
{
  "title": "Blog post title (50-60 characters, SEO-optimised)",
  "excerpt": "Meta description (140-155 characters)",
  "category": "One of: Skincare, Ingredients, Routine, Hygiene, Wellness, Sunscreen",
  "readTime": "X min read",
  "content": "Full blog HTML using <h2>, <h3>, <p>, <ul>, <li>, <strong> tags only. 750-900 words. Include disclaimer paragraph at end.",
  "imagePrompts": [
    "Detailed Imagen prompt for hero image — beauty/skincare flat lay, pastel tones, no text",
    "Detailed Imagen prompt for image 2 — close-up of skincare ingredient or product texture, studio lighting",
    "Detailed Imagen prompt for image 3 — Indian lifestyle scene of someone doing skincare routine, natural light"
  ],
  "tags": ["tag1", "tag2", "tag3", "tag4"]
}`;

    const textRes = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ role: "user", parts: [{ text: blogPrompt }] }],
    });

    const rawText = textRes.text ?? "";
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Gemini did not return valid JSON");
    const blog = JSON.parse(jsonMatch[0]) as {
      title: string;
      excerpt: string;
      category: string;
      readTime: string;
      content: string;
      imagePrompts: string[];
      tags: string[];
    };

    // ── Generate & upload 3 images ────────────────────────────────────────
    const dateStr  = new Date().toISOString().slice(0, 10);
    const baseSlug = toSlug(blog.title);
    const imageUrls: string[] = [];

    for (let i = 0; i < 3; i++) {
      try {
        const prompt = blog.imagePrompts?.[i] ??
          `Professional skincare product photography, clean aesthetic, pastel background, no text`;

        const imgRes = await ai.models.generateImages({
          model: "imagen-3.0-generate-002",
          prompt: `${prompt}. High quality, photorealistic, professional product photography. No text, no watermarks.`,
          config: { numberOfImages: 1, outputMimeType: "image/jpeg" },
        });

        const imageBytes = imgRes.generatedImages?.[0]?.image?.imageBytes;
        if (!imageBytes) continue;

        const fileName = `blog-${baseSlug}-${dateStr}-${i + 1}.jpg`;
        const url = await uploadBase64ToDrive(imageBytes, fileName);
        if (url) imageUrls.push(url);
      } catch (imgErr) {
        console.error(`Image ${i + 1} generation error:`, imgErr instanceof Error ? imgErr.message : imgErr);
      }
    }

    // ── Save to MongoDB ───────────────────────────────────────────────────
    await connectDB();

    // Ensure unique slug
    let slug = baseSlug;
    const clash = await BlogModel.findOne({ slug });
    if (clash) slug = `${baseSlug}-${Date.now()}`;

    const saved = await BlogModel.create({
      title:      blog.title,
      slug,
      excerpt:    blog.excerpt,
      category:   blog.category,
      readTime:   blog.readTime,
      content:    blog.content,
      coverImage: imageUrls[0] ?? "",
      images:     imageUrls,
      author:     "Fluno Team",
      published:  true,
      tags:       blog.tags ?? [],
    });

    return NextResponse.json({
      ok: true,
      blog: { id: saved._id, title: saved.title, slug, images: imageUrls.length },
    });
  } catch (err) {
    console.error("Blog cron error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
