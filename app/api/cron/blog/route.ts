import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { google } from "googleapis";
import { Readable } from "stream";
import { connectDB } from "@/lib/mongodb";
import { BlogModel } from "@/lib/models/Blog";
import { ConfigModel } from "@/lib/models/Config";
import { PushSub } from "@/lib/models/PushSubscription";
import { Newsletter } from "@/lib/models/Newsletter";

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

    // ── Pick today's topic (avoid repeating published posts) ─────────────
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
    );
    const topic = TOPICS[dayOfYear % TOPICS.length];

    await connectDB();
    const recentPosts = await BlogModel.find({}, { title: 1 })
      .sort({ createdAt: -1 })
      .limit(60)
      .lean() as { title: string }[];
    const avoidList = recentPosts.map((p) => `- ${p.title}`).join("\n");

    // ── Generate blog content + image prompts ─────────────────────────────
    const blogPrompt = `You are a professional content writer for Fluno — a mid-premium personal care and hygiene brand from India. Fluno's products include sunscreens, hand wash, and everyday skincare essentials.

Write a complete SEO-optimised blog post for the Fluno blog.

TOPIC SELECTION:
- Choose ONE fresh, specific topic relevant to skincare, suncare, hand hygiene, or personal care for Indian readers.
- Suggested theme for today (use only if not already covered below): "${topic}"
${avoidList ? `- These topics are ALREADY PUBLISHED — do NOT repeat or closely rephrase any of them:\n${avoidList}` : ""}

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

    // gemini-2.0-* models no longer have free-tier quota (verified July 2026).
    // Try current free-tier models in order.
    const TEXT_MODELS = ["gemini-2.5-flash-lite", "gemini-2.5-flash"];
    let rawText = "";
    let lastTextErr: unknown = null;
    for (const model of TEXT_MODELS) {
      try {
        const textRes = await ai.models.generateContent({
          model,
          contents: [{ role: "user", parts: [{ text: blogPrompt }] }],
        });
        rawText = textRes.text ?? "";
        if (rawText) break;
      } catch (e) {
        lastTextErr = e;
      }
    }
    if (!rawText) throw lastTextErr ?? new Error("All text models failed");
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

        // Requires a paid Gemini plan — falls through to stock images on free tier
        const imgRes = await ai.models.generateImages({
          model: "imagen-4.0-fast-generate-001",
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

    // Fallback: Pollinations.ai (FLUX) — free, unlimited, fresh AI-generated
    // images with no API key or credits. Generated in parallel, then uploaded
    // to our own Google Drive so nothing is hotlinked.
    if (imageUrls.length < 3) {
      const needed = [0, 1, 2].slice(imageUrls.length);
      const generated = await Promise.allSettled(
        needed.map(async (i) => {
          const prompt = blog.imagePrompts?.[i] ??
            "Professional skincare product photography, clean aesthetic, pastel background";
          const pollUrl =
            `https://image.pollinations.ai/prompt/${encodeURIComponent(
              `${prompt}. Photorealistic, professional photography, soft studio lighting, no text, no watermark, no brand logos, unbranded packaging`
            )}?width=1200&height=675&nologo=true&seed=${Date.now() + i * 7919}`;

          const res = await fetch(pollUrl, { signal: AbortSignal.timeout(35000) });
          if (!res.ok) throw new Error(`Pollinations HTTP ${res.status}`);
          const buf = Buffer.from(await res.arrayBuffer());
          if (buf.length < 5000) throw new Error("Image too small — likely an error response");

          const url = await uploadBase64ToDrive(
            buf.toString("base64"),
            `blog-${baseSlug}-${dateStr}-${i + 1}.jpg`
          );
          if (!url) throw new Error("Drive upload failed");
          return url;
        })
      );
      for (const r of generated) {
        if (r.status === "fulfilled") imageUrls.push(r.value);
        else console.error("Pollinations image error:", r.reason instanceof Error ? r.reason.message : r.reason);
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

    // ── Notify subscribers (non-fatal) ────────────────────────────────────
    let pushSent = 0;
    let emailsSent = 0;

    // Browser push notifications
    try {
      const subs = await PushSub.find().lean();
      if (subs.length && process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
        const webpush = (await import("web-push")).default;
        webpush.setVapidDetails(
          "mailto:contact@myfluno.com",
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
          process.env.VAPID_PRIVATE_KEY
        );
        const payload = JSON.stringify({
          title: "New on the Fluno blog ✨",
          body:  saved.title,
          url:   `/blog/${slug}`,
        });
        const results = await Promise.allSettled(
          subs.map((s) =>
            webpush.sendNotification(
              { endpoint: s.endpoint, keys: s.keys } as import("web-push").PushSubscription,
              payload
            )
          )
        );
        pushSent = results.filter((r) => r.status === "fulfilled").length;
        const expired = results
          .map((r, i) => (r.status === "rejected" && [(r.reason as { statusCode?: number })?.statusCode, subs[i].endpoint]))
          .filter((x): x is [number, string] => Array.isArray(x) && (x[0] === 410 || x[0] === 404))
          .map(([, ep]) => ep);
        if (expired.length) await PushSub.deleteMany({ endpoint: { $in: expired } });
      }
    } catch (e) {
      console.error("Blog push notify error:", e);
    }

    // Newsletter emails (Resend batch, capped to stay within free-tier limits)
    try {
      const resendKey = process.env.RESEND_API_KEY;
      if (resendKey) {
        const subscribers = await Newsletter.find().limit(90).lean() as { email: string }[];
        if (subscribers.length) {
          const { Resend } = await import("resend");
          const resend = new Resend(resendKey);
          const postUrl = `https://www.myfluno.com/blog/${slug}`;
          const batch = subscribers.map((s) => ({
            from:    "Fluno <contact@myfluno.com>",
            to:      [s.email],
            subject: `${saved.title} — new on the Fluno blog`,
            html: `
              <div style="font-family:sans-serif;max-width:540px;margin:0 auto;padding:28px">
                <h1 style="color:#BD7EFA;font-size:24px;margin:0 0 20px">fluno</h1>
                ${saved.coverImage ? `<img src="${saved.coverImage}" alt="" style="width:100%;border-radius:14px;margin-bottom:18px"/>` : ""}
                <h2 style="color:#1A0A2E;font-size:20px;margin:0 0 10px">${saved.title}</h2>
                <p style="color:#555;font-size:14px;line-height:1.7;margin:0 0 20px">${saved.excerpt ?? ""}</p>
                <a href="${postUrl}" style="display:inline-block;background:#BD7EFA;color:#fff;text-decoration:none;padding:12px 26px;border-radius:12px;font-size:14px;font-weight:600">Read the Article</a>
                <p style="font-size:11px;color:#aaa;margin-top:28px">
                  You're receiving this because you subscribed to Fluno updates.
                  <a href="https://www.myfluno.com/api/newsletter/unsubscribe?email=${encodeURIComponent(s.email)}" style="color:#BD7EFA">Unsubscribe</a>
                </p>
              </div>
            `,
          }));
          const res = await resend.batch.send(batch);
          emailsSent = res.error ? 0 : subscribers.length;
        }
      }
    } catch (e) {
      console.error("Blog newsletter email error:", e);
    }

    return NextResponse.json({
      ok: true,
      blog: { id: saved._id, title: saved.title, slug, images: imageUrls.length },
      notified: { push: pushSent, emails: emailsSent },
    });
  } catch (err) {
    console.error("Blog cron error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
