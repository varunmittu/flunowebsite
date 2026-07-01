import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { getAdminSession } from "@/lib/adminAuth";
import { Readable } from "stream";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!raw) return NextResponse.json({ error: "Google Drive not configured" }, { status: 500 });

  try {
    const credentials = JSON.parse(raw);
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/drive"],
    });
    const drive = google.drive({ version: "v3", auth });

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    if (file.size > 10 * 1024 * 1024)
      return NextResponse.json({ error: "File too large (max 10 MB)" }, { status: 400 });

    if (!file.type.startsWith("image/"))
      return NextResponse.json({ error: "Only image files allowed" }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    const stream = Readable.from(buffer);
    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

    const uploaded = await drive.files.create({
      requestBody: {
        name: `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`,
        ...(folderId ? { parents: [folderId] } : {}),
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
