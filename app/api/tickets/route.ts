import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Ticket } from "@/lib/models/Ticket";

export const dynamic = "force-dynamic";

function generateTicketId() {
  return "TKT-" + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 5).toUpperCase();
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, phone, subject, message, category } = body;

  if (!name || !email || !subject || !message) {
    return NextResponse.json({ error: "Name, email, subject and message are required" }, { status: 400 });
  }

  await connectDB();

  const ticket = await Ticket.create({
    ticketId: generateTicketId(),
    name: name.trim(),
    email: email.toLowerCase().trim(),
    phone: phone?.trim() || undefined,
    subject: subject.trim(),
    message: message.trim(),
    category: category || "other",
  });

  return NextResponse.json({ ok: true, ticketId: ticket.ticketId }, { status: 201 });
}

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");
  if (!email) return NextResponse.json({ tickets: [] });
  await connectDB();
  const tickets = await Ticket.find({ email: email.toLowerCase() })
    .sort({ createdAt: -1 })
    .lean();
  return NextResponse.json({ tickets });
}
