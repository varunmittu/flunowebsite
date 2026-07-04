import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Newsletter } from "@/lib/models/Newsletter";
import { getAdminSession } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

const FROM = "Fluno <contact@myfluno.com>";

function buildHtml(subject: string, message: string) {
  const bodyHtml = message
    .split(/\n{2,}/)
    .map((para) => `<p style="margin:0 0 16px;line-height:1.6;color:#2C2A27;">${para.replace(/\n/g, "<br/>")}</p>`)
    .join("");
  return `<!doctype html><html><body style="margin:0;background:#F1EBE1;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
    <div style="max-width:560px;margin:0 auto;padding:32px 20px;">
      <div style="background:#FAF7F2;border:2px solid #2C2A27;border-radius:20px;padding:28px 26px;">
        <p style="margin:0 0 4px;font-size:22px;font-weight:700;color:#C0785B;letter-spacing:-0.5px;">fluno</p>
        <h1 style="margin:0 0 18px;font-size:20px;color:#2C2A27;">${subject}</h1>
        ${bodyHtml}
        <div style="margin-top:24px;padding-top:16px;border-top:1px solid rgba(44,42,39,0.12);">
          <a href="https://myfluno.com/shop" style="display:inline-block;background:#C0785B;color:#2C2A27;font-weight:600;text-decoration:none;padding:10px 20px;border:2px solid #2C2A27;border-radius:999px;">Shop the range</a>
        </div>
      </div>
      <p style="margin:16px 8px 0;font-size:11px;color:#6E695F;line-height:1.5;">
        You're receiving this because you subscribed at myfluno.com.
        To unsubscribe, reply with "Unsubscribe" or email
        <a href="mailto:contact@myfluno.com?subject=Unsubscribe" style="color:#C0785B;">contact@myfluno.com</a>.
      </p>
    </div>
  </body></html>`;
}

export async function GET() {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();
  const count = await Newsletter.countDocuments();
  return NextResponse.json({ count });
}

export async function POST(req: NextRequest) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { subject, message } = await req.json();
  if (!subject?.trim() || !message?.trim()) {
    return NextResponse.json({ error: "Subject and message are required" }, { status: 400 });
  }

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    return NextResponse.json({ error: "Email is not configured (RESEND_API_KEY missing)" }, { status: 500 });
  }

  await connectDB();
  const subs = await Newsletter.find({}, { email: 1 }).lean() as { email: string }[];
  const emails = Array.from(new Set(subs.map((s) => s.email).filter(Boolean)));
  if (!emails.length) {
    return NextResponse.json({ sent: 0, failed: 0, message: "No subscribers yet" });
  }

  const { Resend } = await import("resend");
  const resend = new Resend(key);
  const html = buildHtml(subject.trim(), message.trim());

  // Send individually so recipients never see each other's addresses.
  const results = await Promise.allSettled(
    emails.map((to) => resend.emails.send({ from: FROM, to, subject: subject.trim(), html }))
  );

  let sent = 0, failed = 0;
  results.forEach((r) => {
    if (r.status === "fulfilled" && !(r.value as { error?: unknown })?.error) sent++;
    else failed++;
  });

  return NextResponse.json({ sent, failed });
}
