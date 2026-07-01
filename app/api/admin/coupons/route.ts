import { NextRequest, NextResponse } from "next/server";
import { connectDB }    from "@/lib/mongodb";
import { CouponModel }  from "@/lib/models/Coupon";
import { getAdminSession } from "@/lib/adminAuth";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const coupons = await CouponModel.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json({ coupons });
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  if (!body.code || !body.type || body.value === undefined) {
    return NextResponse.json({ error: "code, type and value required" }, { status: 400 });
  }

  await connectDB();
  const coupon = await CouponModel.create({ ...body, code: body.code.toUpperCase() });
  return NextResponse.json({ coupon }, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, ...body } = await req.json();
  await connectDB();
  const coupon = await CouponModel.findByIdAndUpdate(id, body, { new: true });
  return NextResponse.json({ coupon });
}

export async function DELETE(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();
  await connectDB();
  await CouponModel.findByIdAndDelete(id);
  return NextResponse.json({ ok: true });
}
