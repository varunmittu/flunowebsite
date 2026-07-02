import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models/User";

export const dynamic = "force-dynamic";

async function getUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;
  await connectDB();
  return User.findOne({ email: session.user.email });
}

export async function GET() {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ addresses: user.addresses ?? [] });
}

export async function POST(req: NextRequest) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { label, name, address, city, state, pincode, phone } = await req.json();
  if (!name || !address || !city || !state || !pincode) {
    return NextResponse.json({ error: "Name, address, city, state and pincode are required" }, { status: 400 });
  }

  // First address is automatically default
  const isDefault = user.addresses.length === 0;
  if (isDefault) {
    user.addresses.forEach((a: { isDefault: boolean }) => { a.isDefault = false; });
  }

  user.addresses.push({ label: label || "Home", name, address, city, state, pincode, phone, isDefault });
  await user.save();
  return NextResponse.json({ ok: true, addresses: user.addresses });
}

export async function PATCH(req: NextRequest) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { id, setDefault, ...fields } = body;

  const addr = user.addresses.id(id);
  if (!addr) return NextResponse.json({ error: "Address not found" }, { status: 404 });

  if (setDefault) {
    user.addresses.forEach((a: { isDefault: boolean }) => { a.isDefault = false; });
    addr.isDefault = true;
  } else {
    Object.assign(addr, fields);
  }

  await user.save();
  return NextResponse.json({ ok: true, addresses: user.addresses });
}

export async function DELETE(req: NextRequest) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();
  user.addresses.pull({ _id: id });
  await user.save();
  return NextResponse.json({ ok: true, addresses: user.addresses });
}
