import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping Policy",
  description: "Fluno shipping and delivery policy — timelines, charges, and tracking.",
};

export default function ShippingPolicy() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <p className="font-mono text-xs text-fluno-teal uppercase tracking-widest mb-2">Legal</p>
      <h1 className="section-title mb-2">Shipping &amp; Delivery Policy</h1>
      <p className="font-mono text-xs text-fluno-ink/40 mb-10">Last updated: July 2026 · Parvar Enterprise (Fluno)</p>

      <div className="prose prose-sm max-w-none font-body text-fluno-ink/80 space-y-8">
        <section>
          <h2 className="font-display text-xl text-fluno-ink mb-3">1. Serviceability</h2>
          <p>We currently ship within India only, to pincodes serviced by our courier partners. If your pincode is unserviceable, the order will be cancelled and refunded in full. We may add or withdraw serviceable areas at any time.</p>
        </section>

        <section>
          <h2 className="font-display text-xl text-fluno-ink mb-3">2. Processing Time</h2>
          <p>Orders are ordinarily processed and dispatched within <strong>1–2 business days</strong> of payment confirmation. During sale events, festivals, or periods of high demand, processing may take up to <strong>5 business days</strong>. Business days exclude Sundays and public holidays.</p>
        </section>

        <section>
          <h2 className="font-display text-xl text-fluno-ink mb-3">3. Delivery Timelines (Estimates Only)</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Telangana:</strong> 2–3 business days</li>
            <li><strong>Metro cities:</strong> 3–5 business days</li>
            <li><strong>Rest of India:</strong> 5–7 business days</li>
            <li><strong>Remote areas:</strong> 7–10 business days</li>
          </ul>
          <p className="mt-3">All timelines are <strong>estimates only and are not guaranteed</strong>. Deliveries are performed by third-party courier partners, and we are not liable for delays caused by couriers, weather, strikes, regulatory restrictions, or other events beyond our reasonable control. Delay in delivery does not entitle you to cancellation charges, compensation, or damages.</p>
        </section>

        <section>
          <h2 className="font-display text-xl text-fluno-ink mb-3">4. Shipping Charges</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Orders of ₹499 and above:</strong> free shipping</li>
            <li><strong>Orders below ₹499:</strong> flat ₹49 shipping charge</li>
          </ul>
          <p className="mt-3">Shipping charges, once an order is dispatched, are non-refundable except where the return arises from our error. We may revise shipping charges and thresholds at any time; the charge shown at checkout applies to your order.</p>
        </section>

        <section>
          <h2 className="font-display text-xl text-fluno-ink mb-3">5. Address Accuracy</h2>
          <p>You are solely responsible for providing a complete and accurate delivery address and reachable phone number. Orders returned to origin (RTO) due to an incorrect or incomplete address, or the recipient being unreachable or unavailable, may be redelivered <strong>at additional shipping cost to you</strong>. If you elect a refund instead, the original shipping cost and the RTO courier cost may be deducted from the refund amount.</p>
        </section>

        <section>
          <h2 className="font-display text-xl text-fluno-ink mb-3">6. Delivery Confirmation, Title &amp; Risk</h2>
          <p>Delivery is deemed complete upon the courier partner&apos;s confirmation of delivery to the address provided (including delivery to a security desk, reception, or household member). Title and risk in the products pass to you upon such delivery. Any claim of non-receipt despite courier confirmation must be raised within <strong>48 hours</strong> of the recorded delivery, after which the order is deemed conclusively delivered.</p>
        </section>

        <section>
          <h2 className="font-display text-xl text-fluno-ink mb-3">7. Order Tracking</h2>
          <p>A tracking link is sent by email once your order is dispatched, and your order status is visible in your Account dashboard. Tracking information is provided by the courier and may lag actual movement.</p>
        </section>

        <section>
          <h2 className="font-display text-xl text-fluno-ink mb-3">8. Failed Delivery Attempts</h2>
          <p>Our courier partners typically attempt delivery up to three times. After failed attempts, the shipment is returned to us and Section 5 (RTO) applies. Please keep your phone reachable during the delivery window.</p>
        </section>

        <section>
          <h2 className="font-display text-xl text-fluno-ink mb-3">9. Lost or Stuck Shipments</h2>
          <p>If tracking shows no movement for more than 7 days, contact us with your order ID. We will investigate with the courier; where a shipment is confirmed lost in transit before delivery, we will, at our option, reship the order or refund the amount paid. This is your sole and exclusive remedy for lost shipments.</p>
        </section>

        <section>
          <h2 className="font-display text-xl text-fluno-ink mb-3">10. Contact</h2>
          <p>For shipping queries, email <a href="mailto:contact@myfluno.com" className="text-fluno-teal hover:underline">contact@myfluno.com</a> with your order ID, or raise a ticket at <a href="/support" className="text-fluno-teal hover:underline">myfluno.com/support</a>.</p>
        </section>
      </div>
    </div>
  );
}
