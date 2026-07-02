import { NextRequest, NextResponse } from "next/server";
import { signAdminToken, ADMIN_COOKIE } from "@/lib/adminAuth";
import { connectDB } from "@/lib/mongodb";
import { LoginAttempt } from "@/lib/models/LoginAttempt";

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  await connectDB();

  // Rate limit: block after repeated failures from the same IP
  const attempt = await LoginAttempt.findOne({ ip });
  if (attempt) {
    const windowExpired = Date.now() - new Date(attempt.firstAt).getTime() > WINDOW_MS;
    if (windowExpired) {
      await LoginAttempt.deleteOne({ ip });
    } else if (attempt.count >= MAX_ATTEMPTS) {
      return NextResponse.json(
        { error: "Too many failed attempts. Try again in 15 minutes." },
        { status: 429 }
      );
    }
  }

  if (
    email    !== process.env.ADMIN_EMAIL    ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    await LoginAttempt.findOneAndUpdate(
      { ip },
      { $inc: { count: 1 }, $setOnInsert: { firstAt: new Date() } },
      { upsert: true }
    );
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  // Successful login clears the counter
  await LoginAttempt.deleteOne({ ip });

  const token = await signAdminToken(email);

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge:   60 * 60 * 12, // 12h
    path:     "/",
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(ADMIN_COOKIE);
  return res;
}
