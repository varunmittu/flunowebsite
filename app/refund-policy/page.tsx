import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Return & Refund Policy",
  description: "Fluno return, refund, and exchange policy.",
};

export default function RefundPolicy() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <p className="font-mono text-xs text-fluno-teal uppercase tracking-widest mb-2">Legal</p>
      <h1 className="section-title mb-2">Return, Refund & Exchange Policy</h1>
      <p className="font-mono text-xs text-fluno-ink/40 mb-10">Last updated: June 2025</p>

      <div className="prose prose-sm max-w-none font-body text-fluno-ink/80 space-y-8">
        <section>
          <h2 className="font-display text-xl text-fluno-ink mb-3">Return Window</h2>
          <p>We accept returns within <strong>7 days</strong> of delivery for products that are:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Unused and in original, sealed packaging</li>
            <li>Damaged, defective, or incorrect on arrival (photo proof required)</li>
          </ul>
          <p className="mt-3">We do not accept returns for opened or used products unless they are defective.</p>
        </section>

        <section>
          <h2 className="font-display text-xl text-fluno-ink mb-3">How to Initiate a Return</h2>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Email <a href="mailto:contact@myfluno.com" className="text-fluno-teal hover:underline">contact@myfluno.com</a> with your order ID and reason for return</li>
            <li>Attach photos if the product is damaged or defective</li>
            <li>We will confirm the return within 48 hours and arrange pickup or ask you to ship it back</li>
          </ol>
        </section>

        <section>
          <h2 className="font-display text-xl text-fluno-ink mb-3">Refunds</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Refunds are processed within <strong>5–7 business days</strong> after we receive and inspect the returned product</li>
            <li>Refunds are credited to the original payment method</li>
            <li>Shipping charges are non-refundable unless the return is due to our error</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl text-fluno-ink mb-3">Exchanges</h2>
          <p>We offer exchanges for the same product (e.g., different quantity) subject to stock availability. Contact us to arrange an exchange within the 7-day window.</p>
        </section>

        <section>
          <h2 className="font-display text-xl text-fluno-ink mb-3">Cancellations</h2>
          <p>Orders can be cancelled within 12 hours of placement at no charge. After dispatch, cancellations are not possible — please initiate a return instead. We do not charge cancellation fees; per Consumer Protection Rules 2020, the same terms apply to us as apply to you.</p>
        </section>

        <section>
          <h2 className="font-display text-xl text-fluno-ink mb-3">Contact</h2>
          <p><a href="mailto:contact@myfluno.com" className="text-fluno-teal hover:underline">contact@myfluno.com</a> · Hyderabad, India</p>
        </section>
      </div>
    </div>
  );
}
