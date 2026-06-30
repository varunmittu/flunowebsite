import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping Policy",
  description: "Fluno shipping and delivery policy — timelines, charges, and tracking.",
};

export default function ShippingPolicy() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <p className="font-mono text-xs text-fluno-teal uppercase tracking-widest mb-2">Legal</p>
      <h1 className="section-title mb-2">Shipping & Delivery Policy</h1>
      <p className="font-mono text-xs text-fluno-ink/40 mb-10">Last updated: June 2025</p>

      <div className="prose prose-sm max-w-none font-body text-fluno-ink/80 space-y-8">
        <section>
          <h2 className="font-display text-xl text-fluno-ink mb-3">Processing Time</h2>
          <p>Orders are processed within 1–2 business days after payment confirmation. You will receive an email confirmation with a tracking link once dispatched.</p>
        </section>

        <section>
          <h2 className="font-display text-xl text-fluno-ink mb-3">Delivery Timelines</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Hyderabad & Telangana:</strong> 2–3 business days</li>
            <li><strong>Metro cities:</strong> 3–5 business days</li>
            <li><strong>Rest of India:</strong> 5–7 business days</li>
            <li><strong>Remote areas:</strong> 7–10 business days</li>
          </ul>
          <p className="mt-3">These are estimates and may be affected by public holidays, courier delays, or weather disruptions.</p>
        </section>

        <section>
          <h2 className="font-display text-xl text-fluno-ink mb-3">Shipping Charges</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Orders above ₹499:</strong> Free shipping</li>
            <li><strong>Orders below ₹499:</strong> ₹49 flat shipping charge</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl text-fluno-ink mb-3">Order Tracking</h2>
          <p>A tracking link will be sent to your email and phone (WhatsApp/SMS) once your order is dispatched. You can also track your order from your Account dashboard.</p>
        </section>

        <section>
          <h2 className="font-display text-xl text-fluno-ink mb-3">Failed Delivery</h2>
          <p>If a delivery attempt fails, our courier partner will attempt delivery twice more. After two failed attempts, the package is returned to us. Contact us at <a href="mailto:contact@myfluno.com" className="text-fluno-teal hover:underline">contact@myfluno.com</a> to arrange redelivery (shipping charges may apply).</p>
        </section>

        <section>
          <h2 className="font-display text-xl text-fluno-ink mb-3">Contact</h2>
          <p>For shipping queries, email <a href="mailto:contact@myfluno.com" className="text-fluno-teal hover:underline">contact@myfluno.com</a> with your order ID.</p>
        </section>
      </div>
    </div>
  );
}
