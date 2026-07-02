import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Newsletter } from "@/lib/models/Newsletter";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");
  if (!email) {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }

  await connectDB();
  await Newsletter.deleteOne({ email: email.toLowerCase().trim() });

  return new NextResponse(
    `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Unsubscribed — Fluno</title></head>
<body style="font-family:sans-serif;display:flex;align-items:center;justify-content:center;min-height:90vh;background:#FAF7FF;color:#1A0A2E">
  <div style="text-align:center;max-width:400px;padding:24px">
    <h1 style="color:#BD7EFA;font-size:28px;margin-bottom:12px">fluno</h1>
    <h2 style="font-size:18px;margin-bottom:8px">You've been unsubscribed</h2>
    <p style="font-size:14px;color:#666;line-height:1.6">You won't receive any more blog updates from us. Changed your mind? You can re-subscribe anytime on <a href="https://www.myfluno.com" style="color:#BD7EFA">myfluno.com</a>.</p>
  </div>
</body></html>`,
    { headers: { "Content-Type": "text/html; charset=utf-8" } }
  );
}
