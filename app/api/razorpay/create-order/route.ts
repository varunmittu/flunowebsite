import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/lib/models/Order";
import { ProductModel } from "@/lib/models/Product";
import { products as staticProducts } from "@/lib/products";
import { CouponModel } from "@/lib/models/Coupon";
import { checkCoupon } from "@/lib/coupons";

interface IncomingItem {
  productId?: string;
  quantity?: number;
}

export async function POST(req: NextRequest) {
  try {
    const { items, address, coupon } = await req.json();

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
    }
    if (!address?.name || !address?.email || !address?.phone || !address?.address || !address?.city || !address?.pincode) {
      return NextResponse.json({ error: "Delivery address is incomplete." }, { status: 400 });
    }

    await connectDB();

    // Re-price every item on the server — never trust client-sent prices
    const verifiedItems = [];
    let subtotal = 0;

    for (const raw of items as IncomingItem[]) {
      const id  = String(raw.productId ?? "");
      const qty = Math.min(Math.max(Math.floor(Number(raw.quantity)) || 0, 1), 20);

      let product: { name: string; price: number; size?: string; images?: string[]; inStock?: boolean } | null = null;

      if (mongoose.isValidObjectId(id)) {
        product = await ProductModel.findOne({ _id: id, active: true }).lean() as typeof product;
      }
      if (!product) {
        product = await ProductModel.findOne({ slug: id, active: true }).lean() as typeof product;
      }
      if (!product) {
        const sp = staticProducts.find((p) => p.id === id || p.slug === id);
        if (sp) product = { name: sp.name, price: sp.price, size: sp.size, images: sp.images, inStock: sp.inStock };
      }

      if (!product) {
        return NextResponse.json({ error: "One of the products in your cart is no longer available." }, { status: 400 });
      }
      if (product.inStock === false) {
        return NextResponse.json({ error: `${product.name} is out of stock.` }, { status: 400 });
      }

      verifiedItems.push({
        productId: id,
        name:      product.name,
        size:      product.size ?? "",
        price:     product.price,
        quantity:  qty,
        image:     product.images?.[0] ?? "",
      });
      subtotal += product.price * qty;
    }

    const shipping = subtotal >= 499 ? 0 : 49;

    // Validate coupon server-side (never trust client discount)
    let discount = 0;
    let couponCode: string | null = null;
    if (coupon && typeof coupon === "string") {
      const check = await checkCoupon(coupon, subtotal);
      if (!check.valid) {
        return NextResponse.json({ error: check.error }, { status: 400 });
      }
      discount   = check.discount ?? 0;
      couponCode = check.code ?? null;
    }

    const total = Math.max(subtotal + shipping - discount, 1);

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(total * 100),
      currency: "INR",
      receipt: `fluno_${Date.now()}`,
    });

    const orderId = `FLN-${Date.now()}`;
    await Order.create({
      orderId,
      items: verifiedItems,
      address,
      subtotal,
      shipping,
      total,
      coupon: couponCode,
      discount,
      status: "pending",
      razorpayOrderId: razorpayOrder.id,
    });

    if (couponCode) {
      await CouponModel.updateOne({ code: couponCode }, { $inc: { usedCount: 1 } });
    }

    return NextResponse.json({
      orderId,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error("Razorpay create-order error:", err);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
