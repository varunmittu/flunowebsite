import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { ContactMessage } from "@/lib/models/ContactMessage";
import { getAdminSession } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();

  const countOnly  = req.nextUrl.searchParams.get("count")  === "1";
  const onlyUnread = req.nextUrl.searchParams.get("unread") === "1";

  if (countOnly) {
    const count = await ContactMessage.countDocuments({ read: false });
    return NextResponse.json({ count });
  }

  const filter = onlyUnread ? { read: false } : {};
  const messages = await ContactMessage.find(filter).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ messages });
}

export async function PATCH(req: NextRequest) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id, read } = await req.json();
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  await connectDB();
  await ContactMessage.findByIdAndUpdate(id, { read });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  await connectDB();
  await ContactMessage.findByIdAndDelete(id);
  return NextResponse.json({ ok: true });
}
