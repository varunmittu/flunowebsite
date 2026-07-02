import { NextRequest, NextResponse } from "next/server";
import webpush from "web-push";
import { connectDB } from "@/lib/mongodb";
import { PushSub } from "@/lib/models/PushSubscription";
import { getAdminSession } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

webpush.setVapidDetails(
  "mailto:contact@myfluno.com",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function POST(req: NextRequest) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, body, url } = await req.json();
  if (!title || !body) {
    return NextResponse.json({ error: "title and body required" }, { status: 400 });
  }

  await connectDB();
  const subs = await PushSub.find().lean();
  if (!subs.length) {
    return NextResponse.json({ sent: 0, failed: 0, message: "No subscribers yet" });
  }

  const payload = JSON.stringify({ title, body, url: url || "/" });

  const results = await Promise.allSettled(
    subs.map((sub) =>
      webpush.sendNotification(
        { endpoint: sub.endpoint, keys: sub.keys } as webpush.PushSubscription,
        payload
      )
    )
  );

  // Remove expired/invalid subscriptions
  const expired: string[] = [];
  results.forEach((r, i) => {
    if (r.status === "rejected") {
      const err = r.reason as { statusCode?: number };
      if (err?.statusCode === 410 || err?.statusCode === 404) {
        expired.push(subs[i].endpoint);
      }
    }
  });
  if (expired.length) {
    await PushSub.deleteMany({ endpoint: { $in: expired } });
  }

  const sent   = results.filter((r) => r.status === "fulfilled").length;
  const failed = results.filter((r) => r.status === "rejected").length;
  return NextResponse.json({ sent, failed });
}

export async function GET() {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();
  const count = await PushSub.countDocuments();
  return NextResponse.json({ count });
}
