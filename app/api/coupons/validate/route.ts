import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { checkCoupon } from "@/lib/coupons";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { code, subtotal } = await req.json();
    if (!code?.trim() || typeof subtotal !== "number") {
      return NextResponse.json({ error: "Coupon code required." }, { status: 400 });
    }
    await connectDB();
    const result = await checkCoupon(code, subtotal);
    if (!result.valid) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Could not validate coupon." }, { status: 500 });
  }
}
