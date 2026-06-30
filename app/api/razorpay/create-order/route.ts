import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/lib/models/Order";

export async function POST(req: NextRequest) {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });
    const { items, address, subtotal, shipping, total, coupon, discount } = await req.json();

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(total * 100),
      currency: "INR",
      receipt: `fluno_${Date.now()}`,
    });

    await connectDB();
    const orderId = `FLN-${Date.now()}`;
    await Order.create({
      orderId,
      items,
      address,
      subtotal,
      shipping,
      total,
      coupon: coupon || null,
      discount: discount || 0,
      status: "pending",
      razorpayOrderId: razorpayOrder.id,
    });

    return NextResponse.json({
      orderId,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error("Razorpay create-order error:", err);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
