import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { PushSub } from "@/lib/models/PushSubscription";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    // Accept both the new { subscription, userEmail } shape and a bare subscription.
    const sub = payload?.subscription ?? payload;
    const userEmail: string = (payload?.userEmail ?? "").toString().trim().toLowerCase();

    if (!sub?.endpoint || !sub?.keys?.p256dh || !sub?.keys?.auth) {
      return NextResponse.json({ error: "Invalid subscription" }, { status: 400 });
    }
    await connectDB();
    // Only overwrite userEmail when we actually have one, so a later anonymous
    // re-subscribe doesn't wipe a previously-linked email.
    const update: Record<string, unknown> = { endpoint: sub.endpoint, keys: sub.keys };
    if (userEmail) update.userEmail = userEmail;

    await PushSub.findOneAndUpdate(
      { endpoint: sub.endpoint },
      { $set: update },
      { upsert: true, new: true }
    );
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Push subscribe error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
