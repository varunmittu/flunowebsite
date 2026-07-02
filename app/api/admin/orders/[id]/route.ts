import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Order }     from "@/lib/models/Order";
import { getAdminSession } from "@/lib/adminAuth";

const VALID_STATUSES = ["pending","paid","processing","shipped","delivered","cancelled","refunded"];

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const order = await Order.findById(params.id).lean();
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ order });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { status, courier, trackingId, trackingUrl } = await req.json();

  const update: Record<string, unknown> = {};
  if (status !== undefined) {
    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    update.status = status;
  }
  if (courier     !== undefined) update.courier     = courier?.trim()     || null;
  if (trackingId  !== undefined) update.trackingId  = trackingId?.trim()  || null;
  if (trackingUrl !== undefined) update.trackingUrl = trackingUrl?.trim() || null;

  await connectDB();
  const prev = await Order.findById(params.id);
  if (!prev) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const prevStatus = prev.status;

  const order = await Order.findByIdAndUpdate(params.id, update, { new: true });

  // Notify the customer when the order moves to shipped/delivered
  const statusChanged = status && status !== prevStatus;
  if (statusChanged && (status === "shipped" || status === "delivered") && order.address?.email) {
    await sendStatusEmail(order, status).catch((e) => console.error("Status email error:", e));
  }

  return NextResponse.json({ order });
}

interface OrderDoc {
  orderId: string;
  total: number;
  courier?: string | null;
  trackingId?: string | null;
  trackingUrl?: string | null;
  address: { name: string; email: string; address: string; city: string; state: string; pincode: string };
  items: { name: string; quantity: number }[];
}

async function sendStatusEmail(order: OrderDoc, status: "shipped" | "delivered") {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) return;

  const { Resend } = await import("resend");
  const resend = new Resend(resendKey);

  const itemsLine = order.items.map((i) => `${i.name} × ${i.quantity}`).join(", ");
  const invoiceUrl = `https://www.myfluno.com/api/orders/invoice?orderId=${order.orderId}&email=${encodeURIComponent(order.address.email)}`;

  const isShipped = status === "shipped";
  const subject = isShipped
    ? `Your order is on its way — ${order.orderId} 📦`
    : `Your order has been delivered — ${order.orderId} ✅`;

  const trackingBlock = isShipped && (order.trackingId || order.trackingUrl)
    ? `
      <div style="background:#faf7ff;border:1px solid #ede9ff;border-radius:12px;padding:16px;margin:18px 0">
        ${order.courier ? `<p style="margin:0 0 6px;font-size:13px;color:#888">Courier: <strong style="color:#1A0A2E">${order.courier}</strong></p>` : ""}
        ${order.trackingId ? `<p style="margin:0 0 6px;font-size:13px;color:#888">Tracking ID: <strong style="color:#1A0A2E">${order.trackingId}</strong></p>` : ""}
        ${order.trackingUrl ? `<a href="${order.trackingUrl}" style="display:inline-block;background:#BD7EFA;color:#fff;text-decoration:none;padding:10px 22px;border-radius:10px;font-size:13px;font-weight:600;margin-top:6px">Track Your Package</a>` : ""}
      </div>`
    : "";

  const body = isShipped
    ? `Good news — your Fluno order has been dispatched and is on its way to you.`
    : `Your Fluno order has been delivered. We hope you love it! If anything isn't right, raise a ticket within 48 hours at <a href="https://www.myfluno.com/support" style="color:#BD7EFA">myfluno.com/support</a>.`;

  await resend.emails.send({
    from:    "Fluno <contact@myfluno.com>",
    to:      [order.address.email],
    subject,
    html: `
      <div style="font-family:sans-serif;max-width:540px;margin:0 auto;padding:28px">
        <h1 style="color:#BD7EFA;font-size:24px;margin:0 0 20px">fluno</h1>
        <h2 style="color:#1A0A2E;font-size:19px;margin:0 0 10px">${isShipped ? `${order.address.name}, your order is on the way! 📦` : `Delivered! Enjoy, ${order.address.name} 💜`}</h2>
        <p style="color:#555;font-size:14px;line-height:1.7">${body}</p>
        <p style="font-size:13px;color:#888;margin:16px 0 4px">Order <strong style="color:#1A0A2E">${order.orderId}</strong> · ${itemsLine} · ₹${order.total.toLocaleString("en-IN")}</p>
        ${trackingBlock}
        <p style="font-size:13px;color:#888;line-height:1.6">
          Delivering to: ${order.address.address}, ${order.address.city}, ${order.address.state} — ${order.address.pincode}
        </p>
        <p style="font-size:12px;margin-top:18px"><a href="${invoiceUrl}" style="color:#BD7EFA">Download your invoice</a></p>
        <p style="font-size:11px;color:#aaa;margin-top:24px">Questions? Reply to this email or visit <a href="https://www.myfluno.com/support" style="color:#BD7EFA">myfluno.com/support</a></p>
      </div>
    `,
  });
}
