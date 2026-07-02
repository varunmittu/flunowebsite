import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/lib/models/Order";

export async function POST(req: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } =
      await req.json();

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    await connectDB();
    // Match on BOTH ids so a signature from one payment can't mark a different order paid
    const order = await Order.findOneAndUpdate(
      { orderId, razorpayOrderId: razorpay_order_id },
      {
        status: "paid",
        paymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
      },
      { new: true }
    );

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Order confirmation email (non-fatal if it fails)
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey && order.address?.email) {
      try {
        const { Resend } = await import("resend");
        const resend = new Resend(resendKey);
        const itemRows = order.items.map((i: { name: string; quantity: number; price: number }) =>
          `<tr>
            <td style="padding:10px 0;border-bottom:1px solid #f0eaf9">${i.name} × ${i.quantity}</td>
            <td style="padding:10px 0;border-bottom:1px solid #f0eaf9;text-align:right">₹${(i.price * i.quantity).toLocaleString("en-IN")}</td>
          </tr>`
        ).join("");

        await resend.emails.send({
          from:    "Fluno <contact@myfluno.com>",
          to:      [order.address.email],
          subject: `Order confirmed — ${order.orderId}`,
          html: `
            <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:28px">
              <h1 style="color:#BD7EFA;font-size:26px;margin:0 0 4px">fluno</h1>
              <p style="color:#888;font-size:12px;margin:0 0 24px">Care in Every Drop</p>
              <h2 style="color:#1A0A2E;font-size:20px;margin:0 0 8px">Thanks for your order, ${order.address.name}! 💜</h2>
              <p style="color:#555;font-size:14px;line-height:1.6;margin:0 0 20px">
                Your payment was received and your order is confirmed. We'll email you again when it ships.
              </p>
              <p style="font-size:13px;color:#888;margin:0 0 6px">Order ID</p>
              <p style="font-size:16px;font-weight:700;color:#1A0A2E;margin:0 0 20px">${order.orderId}</p>
              <table style="width:100%;border-collapse:collapse;font-size:14px;color:#333">
                ${itemRows}
                <tr><td style="padding:10px 0;color:#888">Shipping</td><td style="padding:10px 0;text-align:right">${order.shipping === 0 ? "Free" : `₹${order.shipping}`}</td></tr>
                <tr><td style="padding:12px 0;font-weight:700;font-size:16px">Total</td><td style="padding:12px 0;text-align:right;font-weight:700;font-size:16px;color:#BD7EFA">₹${order.total.toLocaleString("en-IN")}</td></tr>
              </table>
              <p style="font-size:13px;color:#888;line-height:1.6;margin:24px 0 0">
                Delivering to: ${order.address.address}, ${order.address.city}, ${order.address.state} — ${order.address.pincode}
              </p>
              <p style="font-size:12px;margin-top:16px">
                <a href="https://www.myfluno.com/api/orders/invoice?orderId=${order.orderId}&email=${encodeURIComponent(order.address.email)}" style="color:#BD7EFA">Download your GST invoice</a>
              </p>
              <p style="font-size:11px;color:#aaa;margin-top:28px">
                Questions? Reply to this email or visit <a href="https://myfluno.com/support" style="color:#BD7EFA">myfluno.com/support</a>
              </p>
            </div>
          `,
        });
      } catch (emailErr) {
        console.error("Order confirmation email error:", emailErr);
      }
    }

    return NextResponse.json({ success: true, orderId });
  } catch (err) {
    console.error("Razorpay verify error:", err);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
