import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models/User";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email?.trim()) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    await connectDB();
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    // Always return success to prevent email enumeration
    if (user && user.password) {
      const token = crypto.randomBytes(32).toString("hex");
      user.resetToken = crypto.createHash("sha256").update(token).digest("hex");
      user.resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
      await user.save();

      const resetUrl = `https://www.myfluno.com/reset-password?token=${token}&email=${encodeURIComponent(user.email)}`;

      const resendKey = process.env.RESEND_API_KEY;
      if (resendKey) {
        const { Resend } = await import("resend");
        const resend = new Resend(resendKey);
        await resend.emails.send({
          from:    "Fluno <contact@myfluno.com>",
          to:      [user.email],
          subject: "Reset your Fluno password",
          html: `
            <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:28px">
              <h1 style="color:#BD7EFA;font-size:24px;margin:0 0 20px">fluno</h1>
              <h2 style="color:#1A0A2E;font-size:18px;margin:0 0 10px">Reset your password</h2>
              <p style="color:#555;font-size:14px;line-height:1.6">
                We received a request to reset the password for your Fluno account.
                Click the button below to choose a new password. This link expires in <strong>1 hour</strong>.
              </p>
              <a href="${resetUrl}" style="display:inline-block;background:#BD7EFA;color:#fff;text-decoration:none;padding:12px 28px;border-radius:12px;font-size:14px;font-weight:600;margin:18px 0">
                Reset Password
              </a>
              <p style="color:#888;font-size:12px;line-height:1.6">
                If the button doesn't work, copy this link into your browser:<br/>
                <a href="${resetUrl}" style="color:#BD7EFA;word-break:break-all">${resetUrl}</a>
              </p>
              <p style="color:#aaa;font-size:11px;margin-top:24px">
                If you didn't request this, you can safely ignore this email — your password will not change.
              </p>
            </div>
          `,
        });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Forgot password error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
