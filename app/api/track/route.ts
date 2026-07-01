import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const sheetId = process.env.GOOGLE_ANALYTICS_SHEET_ID;
  if (!sheetId) return NextResponse.json({ ok: true });

  try {
    const body = await req.json();
    const { page, referrer, sessionId, userEmail, gender, age } = body;

    const ua = req.headers.get("user-agent") ?? "";
    const device = /mobile|android|iphone|ipad/i.test(ua) ? "mobile" : "desktop";
    const timestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

    const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON ?? "";
    if (!raw) return NextResponse.json({ ok: true });
    const key = JSON.parse(raw);

    const auth = new google.auth.GoogleAuth({
      credentials: key,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    const sheets = google.sheets({ version: "v4", auth });

    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: "Sheet1!A:J",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[
          timestamp,
          sessionId ?? "",
          page ?? "",
          referrer ?? "",
          device,
          userEmail ?? "",
          gender ?? "",
          age ?? "",
        ]],
      },
    });
  } catch {
    // Silent fail — tracking should never break the site
  }

  return NextResponse.json({ ok: true });
}
