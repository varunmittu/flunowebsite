import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Ticket } from "@/lib/models/Ticket";
import { getAdminSession } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();
  const status = req.nextUrl.searchParams.get("status");
  const filter = status && status !== "all" ? { status } : {};
  const tickets = await Ticket.find(filter).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ tickets });
}

export async function PATCH(req: NextRequest) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const { id, status, priority, adminNote, addMessage, text } = body;
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  await connectDB();

  // Admin sends a chat message
  if (addMessage && text) {
    const ticket = await Ticket.findById(id);
    if (!ticket) return NextResponse.json({ error: "Not found" }, { status: 404 });
    ticket.messages.push({ sender: "admin", text: text.trim() });
    await ticket.save();
    return NextResponse.json({ ok: true, ticket });
  }

  const update: Record<string, unknown> = {};
  if (status)                  update.status    = status;
  if (priority)                update.priority  = priority;
  if (adminNote !== undefined) update.adminNote = adminNote;

  const ticket = await Ticket.findByIdAndUpdate(id, update, { new: true });
  return NextResponse.json({ ok: true, ticket });
}
