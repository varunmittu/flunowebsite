import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Ticket } from "@/lib/models/Ticket";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

async function checkAdmin() {
  const cookieStore = cookies();
  return cookieStore.get("admin_token")?.value === "flunoAdmin2024";
}

export async function GET(req: NextRequest) {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();
  const status = req.nextUrl.searchParams.get("status");
  const filter = status && status !== "all" ? { status } : {};
  const tickets = await Ticket.find(filter).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ tickets });
}

export async function PATCH(req: NextRequest) {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const { id, status, priority, adminNote } = body;
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  await connectDB();
  const update: Record<string, unknown> = {};
  if (status)    update.status    = status;
  if (priority)  update.priority  = priority;
  if (adminNote !== undefined) update.adminNote = adminNote;

  const ticket = await Ticket.findByIdAndUpdate(id, update, { new: true });
  return NextResponse.json({ ok: true, ticket });
}
