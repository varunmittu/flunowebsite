import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/lib/models/Order";

export const dynamic = "force-dynamic";

const GSTIN = process.env.COMPANY_GSTIN || "";

export async function GET(req: NextRequest) {
  const orderId = req.nextUrl.searchParams.get("orderId");
  const email   = req.nextUrl.searchParams.get("email");

  if (!orderId || !email) {
    return NextResponse.json({ error: "orderId and email are required" }, { status: 400 });
  }

  await connectDB();
  const order = await Order.findOne({
    orderId,
    "address.email": { $regex: `^${email.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, $options: "i" },
  }).lean() as {
    orderId: string; createdAt: Date; status: string; paymentId?: string;
    subtotal: number; shipping: number; discount: number; coupon?: string; total: number;
    address: { name: string; email: string; phone: string; address: string; city: string; state: string; pincode: string };
    items: { name: string; size?: string; price: number; quantity: number }[];
  } | null;

  if (!order) {
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  }
  if (!["paid", "processing", "shipped", "delivered"].includes(order.status)) {
    return NextResponse.json({ error: "Invoice available only for paid orders" }, { status: 400 });
  }

  const rows = order.items.map((i, n) => `
    <tr>
      <td>${n + 1}</td>
      <td>${i.name}${i.size ? ` (${i.size})` : ""}</td>
      <td class="num">${i.quantity}</td>
      <td class="num">₹${i.price.toLocaleString("en-IN")}</td>
      <td class="num">₹${(i.price * i.quantity).toLocaleString("en-IN")}</td>
    </tr>`).join("");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Invoice ${order.orderId} — Fluno</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family: -apple-system, "Segoe UI", Roboto, sans-serif; color:#1A0A2E; padding:40px; max-width:760px; margin:0 auto; font-size:14px; }
  .head { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:32px; }
  .brand { font-size:32px; font-weight:800; color:#BD7EFA; letter-spacing:-1px; }
  .brand small { display:block; font-size:11px; color:#888; font-weight:400; letter-spacing:0.5px; margin-top:2px; }
  .inv-meta { text-align:right; font-size:12px; color:#555; line-height:1.7; }
  .inv-meta strong { color:#1A0A2E; font-size:15px; }
  .parties { display:flex; gap:32px; margin-bottom:28px; }
  .party { flex:1; background:#faf7ff; border:1px solid #ede9ff; border-radius:10px; padding:14px 16px; font-size:12px; line-height:1.7; color:#555; }
  .party h3 { font-size:10px; text-transform:uppercase; letter-spacing:1px; color:#999; margin-bottom:6px; }
  .party strong { color:#1A0A2E; }
  table { width:100%; border-collapse:collapse; margin-bottom:22px; }
  th { text-align:left; font-size:10px; text-transform:uppercase; letter-spacing:0.8px; color:#999; border-bottom:2px solid #ede9ff; padding:8px 10px; }
  td { padding:10px; border-bottom:1px solid #f4f0fc; }
  .num { text-align:right; }
  th.num { text-align:right; }
  .totals { margin-left:auto; width:280px; font-size:13px; }
  .totals div { display:flex; justify-content:space-between; padding:5px 10px; color:#555; }
  .totals .grand { border-top:2px solid #ede9ff; margin-top:6px; padding-top:10px; font-size:17px; font-weight:700; color:#1A0A2E; }
  .grand span:last-child { color:#BD7EFA; }
  .note { margin-top:36px; font-size:11px; color:#999; line-height:1.7; border-top:1px solid #ede9ff; padding-top:16px; }
  .print-btn { position:fixed; top:18px; right:18px; background:#BD7EFA; color:#fff; border:none; border-radius:10px; padding:10px 20px; font-size:13px; font-weight:600; cursor:pointer; }
  @media print { .print-btn { display:none; } body { padding:20px; } }
</style>
</head>
<body>
  <button class="print-btn" onclick="window.print()">Print / Save PDF</button>

  <div class="head">
    <div class="brand">fluno<small>Care in Every Drop</small></div>
    <div class="inv-meta">
      <strong>TAX INVOICE</strong><br/>
      Invoice No: INV-${order.orderId.replace("FLN-", "")}<br/>
      Order ID: ${order.orderId}<br/>
      Date: ${new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}<br/>
      ${order.paymentId ? `Payment Ref: ${order.paymentId}` : ""}
    </div>
  </div>

  <div class="parties">
    <div class="party">
      <h3>Sold By</h3>
      <strong>Parvar Enterprises (Fluno)</strong><br/>
      6-27, Kubeer, Batti Galli,<br/>
      Kubeer, Adilabad — 504103<br/>
      Telangana, India<br/>
      ${GSTIN ? `GSTIN: ${GSTIN}` : "GSTIN: —"}<br/>
      contact@myfluno.com
    </div>
    <div class="party">
      <h3>Billed To</h3>
      <strong>${order.address.name}</strong><br/>
      ${order.address.address}<br/>
      ${order.address.city}, ${order.address.state} — ${order.address.pincode}<br/>
      ${order.address.phone} · ${order.address.email}
    </div>
  </div>

  <table>
    <thead>
      <tr><th>#</th><th>Item</th><th class="num">Qty</th><th class="num">Unit Price</th><th class="num">Amount</th></tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>

  <div class="totals">
    <div><span>Subtotal</span><span>₹${order.subtotal.toLocaleString("en-IN")}</span></div>
    <div><span>Shipping</span><span>${order.shipping === 0 ? "Free" : `₹${order.shipping.toLocaleString("en-IN")}`}</span></div>
    ${order.discount ? `<div><span>Discount${order.coupon ? ` (${order.coupon})` : ""}</span><span>−₹${order.discount.toLocaleString("en-IN")}</span></div>` : ""}
    <div class="grand"><span>Total</span><span>₹${order.total.toLocaleString("en-IN")}</span></div>
  </div>

  <div class="note">
    Prices are inclusive of GST where applicable. This is a computer-generated invoice and does not require a signature.<br/>
    For questions about this invoice, write to contact@myfluno.com quoting your Order ID.
  </div>
</body>
</html>`;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
