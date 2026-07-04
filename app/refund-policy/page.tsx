import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Return & Refund Policy",
  description: "Fluno return, refund, and exchange policy.",
};

export default function RefundPolicy() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <p className="font-fig-body text-xs text-fig-terracotta uppercase tracking-widest mb-2">Legal</p>
      <h1 className="font-fig font-bold text-3xl md:text-4xl text-fig-navy leading-tight mb-2">Return, Refund &amp; Cancellation Policy</h1>
      <p className="font-fig-body text-xs text-fig-navy/40 mb-10">Last updated: July 2026 · Parvar Enterprise (Fluno)</p>

      <div className="prose prose-sm max-w-none font-fig-body text-fig-navy/80 space-y-8">
        <section className="reveal">
          <h2 className="font-fig font-bold text-xl text-fig-navy mb-3">1. Hygiene &amp; Personal Care Exclusion</h2>
          <p>Our products are personal care and hygiene items. For reasons of health, hygiene, and consumer safety, <strong>products that have been opened, unsealed, used, or tampered with are not eligible for return, refund, or exchange</strong>, except where the product is defective. This exclusion is consistent with the Consumer Protection (E-Commerce) Rules, 2020 treatment of goods unsuitable for return on hygiene grounds.</p>
        </section>

        <section className="reveal">
          <h2 className="font-fig font-bold text-xl text-fig-navy mb-3">2. Eligible Returns</h2>
          <p>A return request may be raised within <strong>48 hours of recorded delivery</strong> only in the following cases:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Damaged in transit</strong> — product received broken, leaking, or crushed</li>
            <li><strong>Defective</strong> — manufacturing defect rendering the product unusable</li>
            <li><strong>Incorrect item</strong> — product received differs from what was ordered</li>
            <li><strong>Unopened return</strong> — product in its original, sealed, saleable condition with all packaging intact, requested within <strong>7 days of delivery</strong></li>
          </ul>
          <p className="mt-3"><strong>Mandatory proof requirements:</strong> All return requests must be raised as a support ticket at <a href="/support" className="text-fig-terracotta hover:underline">myfluno.com/support</a>, and clear photographs of the damaged or defective product — including the outer packaging, inner packaging, shipping label, and the product itself — <strong>must be uploaded in the ticket chat</strong> using the image-attachment option. Where available, an unboxing video strengthens the claim. <strong>Return requests without images uploaded in the ticket chat will not be processed.</strong> Claims raised after the applicable window, or without adequate proof, may be declined at our sole discretion.</p>
        </section>

        <section className="reveal">
          <h2 className="font-fig font-bold text-xl text-fig-navy mb-3">3. Return Process</h2>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Raise a support ticket at <a href="/support" className="text-fig-terracotta hover:underline">myfluno.com/support</a> with your order ID and reason, then <strong>upload photographs of the damaged product in the ticket chat</strong> — this step is mandatory before any return claim is reviewed</li>
            <li>We will respond within 48 business hours and, if the claim is approved, arrange a reverse pickup or ask you to ship the product to us</li>
            <li>Returned products undergo <strong>quality inspection on receipt</strong>; approval of the return request does not guarantee a refund — the refund is confirmed only after inspection verifies the claimed condition</li>
            <li>Products returned in a condition inconsistent with the claim (e.g., used, tampered, missing components) will be rejected and may be shipped back to you at your cost</li>
          </ol>
        </section>

        <section className="reveal">
          <h2 className="font-fig font-bold text-xl text-fig-navy mb-3">4. Refunds</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Approved refunds are processed within <strong>5–7 business days of completed inspection</strong>, to the original payment method; bank posting times may add further days beyond our control</li>
            <li>At our option, and with your agreement, refunds may instead be issued as store credit or a replacement</li>
            <li><strong>Original shipping charges are non-refundable</strong> unless the return arises from our error (damage, defect, or wrong item)</li>
            <li>For unopened change-of-mind returns, <strong>return shipping is at your cost</strong>, and reverse-pickup charges (where arranged by us) may be deducted from the refund</li>
            <li>Coupon discounts, promotional credits, and free items associated with the returned order must be returned or their value will be deducted</li>
          </ul>
        </section>

        <section className="reveal">
          <h2 className="font-fig font-bold text-xl text-fig-navy mb-3">5. Exchanges</h2>
          <p>Exchanges are offered only for damaged, defective, or incorrect items, subject to stock availability, and follow the same proof and inspection process. If a replacement is unavailable, a refund will be issued instead.</p>
        </section>

        <section className="reveal">
          <h2 className="font-fig font-bold text-xl text-fig-navy mb-3">6. Cancellations</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>By you:</strong> Orders may be cancelled free of charge any time <strong>before dispatch</strong> by writing to us with your order ID. Once dispatched, an order cannot be cancelled — the return provisions above apply instead</li>
            <li><strong>By us:</strong> We may cancel any order before dispatch — including for pricing or listing errors, stock unavailability, unserviceable pincode, or suspected fraud or abuse — with a full refund of the amount paid as your sole and exclusive remedy</li>
          </ul>
        </section>

        <section className="reveal">
          <h2 className="font-fig font-bold text-xl text-fig-navy mb-3">7. Abuse of Policy</h2>
          <p>We reserve the right to decline returns, refunds, or future orders from customers who, in our reasonable assessment, engage in excessive or fraudulent return activity, misuse promotional offers, or breach our Terms &amp; Conditions.</p>
        </section>

        <section className="reveal">
          <h2 className="font-fig font-bold text-xl text-fig-navy mb-3">8. Chargebacks</h2>
          <p>Please contact us before initiating a chargeback — most issues are resolved faster through our support channels. Chargebacks raised on transactions that comply with this Policy and our Terms will be contested with full transaction evidence, and the associated account may be suspended.</p>
        </section>

        <section className="reveal">
          <h2 className="font-fig font-bold text-xl text-fig-navy mb-3">9. Contact</h2>
          <p><a href="mailto:contact@myfluno.com" className="text-fig-terracotta hover:underline">contact@myfluno.com</a> · <a href="/support" className="text-fig-terracotta hover:underline">myfluno.com/support</a> · Parvar Enterprises, India</p>
        </section>
      </div>
    </div>
  );
}
