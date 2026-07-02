import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { Readable } from "stream";
import { connectDB } from "@/lib/mongodb";
import { ConfigModel } from "@/lib/models/Config";
import { Ticket } from "@/lib/models/Ticket";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

const REDIRECT_URI = "https://www.myfluno.com/api/admin/drive/callback";
const FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID;
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const MAX_IMAGES_PER_TICKET = 10;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file     = formData.get("file") as File | null;
    const ticketId = formData.get("ticketId") as string | null;
    const email    = formData.get("email") as string | null;

    if (!file)              return NextResponse.json({ error: "No file provided" }, { status: 400 });
    if (!ticketId || !email) return NextResponse.json({ error: "Ticket ID and email required" }, { status: 400 });

    if (!file.type.startsWith("image/"))
      return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 });
    if (file.size > MAX_SIZE)
      return NextResponse.json({ error: "Image too large (max 5 MB)" }, { status: 400 });

    await connectDB();

    // Only the ticket owner (ticketId + matching email) can upload
    const ticket = await Ticket.findOne({ ticketId, email: email.toLowerCase().trim() });
    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    // Cap uploads per ticket to prevent abuse
    const imageCount = ticket.messages.filter((m: { image?: string }) => m.image).length;
    if (imageCount >= MAX_IMAGES_PER_TICKET) {
      return NextResponse.json({ error: "Image limit reached for this ticket" }, { status: 400 });
    }

    const config = await ConfigModel.findOne({ key: "google_drive_refresh_token" });
    if (!config?.value) {
      return NextResponse.json({ error: "Upload service unavailable. Please email the photo to contact@myfluno.com" }, { status: 503 });
    }

    const oauth2 = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      REDIRECT_URI
    );
    oauth2.setCredentials({ refresh_token: config.value });
    const drive = google.drive({ version: "v3", auth: oauth2 });

    const buffer = Buffer.from(await file.arrayBuffer());
    const uploaded = await drive.files.create({
      requestBody: {
        name: `ticket-${ticketId}-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`,
        ...(FOLDER_ID ? { parents: [FOLDER_ID] } : {}),
      },
      media: { mimeType: file.type, body: Readable.from(buffer) },
      fields: "id",
    });

    const fileId = uploaded.data.id!;
    await drive.permissions.create({
      fileId,
      requestBody: { role: "reader", type: "anyone" },
    });

    return NextResponse.json({ url: `https://lh3.googleusercontent.com/d/${fileId}` });
  } catch (e) {
    console.error("Ticket image upload error:", e);
    return NextResponse.json({ error: "Upload failed. Please try again." }, { status: 500 });
  }
}
