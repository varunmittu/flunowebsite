import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { PushSub } from "@/lib/models/PushSubscription";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const sub = await req.json();
    if (!sub?.endpoint || !sub?.keys?.p256dh || !sub?.keys?.auth) {
      return NextResponse.json({ error: "Invalid subscription" }, { status: 400 });
    }
    await connectDB();
    await PushSub.findOneAndUpdate(
      { endpoint: sub.endpoint },
      { endpoint: sub.endpoint, keys: sub.keys },
      { upsert: true, new: true }
    );
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Push subscribe error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
