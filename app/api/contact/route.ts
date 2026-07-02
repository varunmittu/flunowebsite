import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { ContactMessage } from "@/lib/models/ContactMessage";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ error: "Name, email and message are required." }, { status: 400 });
    }
    if (!email.includes("@")) {
      return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
    }

    await connectDB();
    await ContactMessage.create({ name: name.trim(), email: email.trim(), subject: subject || "General", message: message.trim() });

    // Send email notification via Resend if API key is configured
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      try {
        const { Resend } = await import("resend");
        const resend = new Resend(resendKey);
        await resend.emails.send({
          from:    "Fluno Contact <contact@myfluno.com>",
          to:      ["contact@myfluno.com"],
          replyTo: email.trim(),
          subject: `[Contact] ${subject || "General"} — ${name.trim()}`,
          html: `
            <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
              <h2 style="color:#BD7EFA;margin:0 0 16px">New Contact Message</h2>
              <table style="width:100%;border-collapse:collapse;font-size:14px">
                <tr><td style="padding:8px 0;color:#888;width:90px">From</td><td style="padding:8px 0;font-weight:600">${name.trim()}</td></tr>
                <tr><td style="padding:8px 0;color:#888">Email</td><td style="padding:8px 0"><a href="mailto:${email.trim()}" style="color:#BD7EFA">${email.trim()}</a></td></tr>
                <tr><td style="padding:8px 0;color:#888">Subject</td><td style="padding:8px 0">${subject || "General"}</td></tr>
              </table>
              <hr style="border:none;border-top:1px solid #eee;margin:16px 0"/>
              <p style="font-size:15px;line-height:1.7;color:#333;white-space:pre-wrap">${message.trim()}</p>
              <p style="font-size:11px;color:#aaa;margin-top:24px">Sent via myfluno.com contact form</p>
            </div>
          `,
        });
      } catch (emailErr) {
        console.error("Email send error:", emailErr);
        // Message still saved — don't fail the request
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
