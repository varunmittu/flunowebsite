import { google } from "googleapis";

const SHEET_ID = process.env.GOOGLE_LOG_SHEET_ID;

function getAuth() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!raw) return null;
  try {
    const creds = JSON.parse(raw);
    return new google.auth.GoogleAuth({
      credentials: creds,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
  } catch {
    return null;
  }
}

export async function logUserEvent(
  name: string,
  email: string,
  phone: string,
  method: "google" | "email",
  action: "signup" | "login"
) {
  if (!SHEET_ID) return;
  const auth = getAuth();
  if (!auth) return;

  try {
    const sheets = google.sheets({ version: "v4", auth });
    const timestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: "Sheet1!A:F",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[timestamp, name || "", email || "", phone || "", method, action]],
      },
    });
  } catch (e) {
    console.error("Sheets log error:", e instanceof Error ? e.message : e);
  }
}
