import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Ticket } from "@/lib/models/Ticket";

export const dynamic = "force-dynamic";

function generateTicketId() {
  return "TKT-" + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 5).toUpperCase();
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  // Add reply to existing ticket (text, image, or both)
  if (body.ticketId && body.email && (body.text?.trim() || body.image)) {
    // Only accept images that came through our own upload endpoint
    if (body.image && !String(body.image).startsWith("https://lh3.googleusercontent.com/d/")) {
      return NextResponse.json({ error: "Invalid image" }, { status: 400 });
    }
    await connectDB();
    const ticket = await Ticket.findOne({
      ticketId: body.ticketId,
      email:    body.email.toLowerCase().trim(),
    });
    if (!ticket) return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    ticket.messages.push({
      sender: "customer",
      text:   body.text?.trim() ?? "",
      image:  body.image || null,
    });
    await ticket.save();
    return NextResponse.json({ ok: true, ticket });
  }

  // Create new ticket
  const { name, email, phone, subject, message, category } = body;
  if (!name || !email || !subject || !message) {
    return NextResponse.json({ error: "Name, email, subject and message are required" }, { status: 400 });
  }

  await connectDB();
  const ticket = await Ticket.create({
    ticketId: generateTicketId(),
    name:     name.trim(),
    email:    email.toLowerCase().trim(),
    phone:    phone?.trim() || undefined,
    subject:  subject.trim(),
    message:  message.trim(),
    category: category || "other",
    messages: [{ sender: "customer", text: message.trim() }],
  });

  return NextResponse.json({ ok: true, ticketId: ticket.ticketId }, { status: 201 });
}

export async function GET(req: NextRequest) {
  const emailParam = req.nextUrl.searchParams.get("email");
  const ticketId   = req.nextUrl.searchParams.get("ticketId");

  if (!emailParam) return NextResponse.json({ tickets: [] });
  await connectDB();

  if (ticketId) {
    const ticket = await Ticket.findOne({
      ticketId,
      email: emailParam.toLowerCase(),
    }).lean();
    return NextResponse.json({ ticket: ticket ?? null });
  }

  const tickets = await Ticket.find({ email: emailParam.toLowerCase() })
    .sort({ createdAt: -1 })
    .lean();
  return NextResponse.json({ tickets });
}
