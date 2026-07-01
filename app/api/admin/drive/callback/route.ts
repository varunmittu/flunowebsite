import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { connectDB } from "@/lib/mongodb";
import { ConfigModel } from "@/lib/models/Config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const REDIRECT_URI = "https://www.myfluno.com/api/admin/drive/callback";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const error = req.nextUrl.searchParams.get("error");

  if (error) {
    return NextResponse.redirect(
      new URL(`/admin/drive-setup?error=${encodeURIComponent(error)}`, req.url)
    );
  }

  if (!code) {
    return NextResponse.redirect(new URL("/admin/drive-setup?error=no_code", req.url));
  }

  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      REDIRECT_URI
    );

    const { tokens } = await oauth2Client.getToken(code);

    if (!tokens.refresh_token) {
      return NextResponse.redirect(
        new URL("/admin/drive-setup?error=no_refresh_token", req.url)
      );
    }

    await connectDB();
    await ConfigModel.findOneAndUpdate(
      { key: "google_drive_refresh_token" },
      { key: "google_drive_refresh_token", value: tokens.refresh_token, updatedAt: new Date() },
      { upsert: true, new: true }
    );

    return NextResponse.redirect(new URL("/admin/drive-setup?success=1", req.url));
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Auth failed";
    return NextResponse.redirect(
      new URL(`/admin/drive-setup?error=${encodeURIComponent(msg)}`, req.url)
    );
  }
}
