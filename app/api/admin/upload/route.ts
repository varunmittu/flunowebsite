import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { getAdminSession } from "@/lib/adminAuth";
import { connectDB } from "@/lib/mongodb";
import { ConfigModel } from "@/lib/models/Config";
import { Readable } from "stream";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

const REDIRECT_URI = "https://www.myfluno.com/api/admin/drive/callback";
const FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID;

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    // Load refresh token from MongoDB (set during Drive setup)
    await connectDB();
    const config = await ConfigModel.findOne({ key: "google_drive_refresh_token" });
    const refreshToken = config?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { error: "Google Drive not connected. Go to Admin → Drive Setup first." },
        { status: 400 }
      );
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      REDIRECT_URI
    );
    oauth2Client.setCredentials({ refresh_token: refreshToken });
    const drive = google.drive({ version: "v3", auth: oauth2Client });

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    if (file.size > 10 * 1024 * 1024)
      return NextResponse.json({ error: "File too large (max 10 MB)" }, { status: 400 });

    if (!file.type.startsWith("image/"))
      return NextResponse.json({ error: "Only image files allowed" }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    const stream = Readable.from(buffer);

    const uploaded = await drive.files.create({
      requestBody: {
        name: `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`,
        ...(FOLDER_ID ? { parents: [FOLDER_ID] } : {}),
      },
      media: { mimeType: file.type, body: stream },
      fields: "id",
    });

    const fileId = uploaded.data.id!;

    await drive.permissions.create({
      fileId,
      requestBody: { role: "reader", type: "anyone" },
    });

    const url = `https://lh3.googleusercontent.com/d/${fileId}`;
    return NextResponse.json({ url, fileId });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Upload failed";
    console.error("Drive upload error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
