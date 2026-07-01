import { NextResponse } from "next/server";
import { google } from "googleapis";
import { getAdminSession } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

const REDIRECT_URI = "https://www.myfluno.com/api/admin/drive/callback";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    REDIRECT_URI
  );

  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: ["https://www.googleapis.com/auth/drive.file"],
  });

  return NextResponse.redirect(url);
}
