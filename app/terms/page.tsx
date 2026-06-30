import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Fluno Terms and Conditions of sale and use.",
};

export default function Terms() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <p className="font-mono text-xs text-fluno-teal uppercase tracking-widest mb-2">Legal</p>
      <h1 className="section-title mb-2">Terms & Conditions</h1>
      <p className="font-mono text-xs text-fluno-ink/40 mb-10">Last updated: June 2025 · Parvar Enterprise (Fluno)</p>

      <div className="prose prose-sm max-w-none font-body text-fluno-ink/80 space-y-8">
        <section>
          <h2 className="font-display text-xl text-fluno-ink mb-3">1. Agreement</h2>
          <p>By using myfluno.com or placing an order, you agree to these Terms. These are governed by Indian law, including the Consumer Protection Act 2019 and the Consumer Protection (E-Commerce) Rules 2020.</p>
        </section>

        <section>
          <h2 className="font-display text-xl text-fluno-ink mb-3">2. Products and Pricing</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>All prices are in Indian Rupees (₹) and include applicable GST unless stated otherwise</li>
            <li>Product images are representative; minor packaging variations may occur</li>
            <li>We reserve the right to change prices without prior notice; the price at time of order is binding</li>
            <li>We show a full price breakdown at checkout — no bundled or hidden totals</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl text-fluno-ink mb-3">3. Orders and Payment</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Orders are confirmed only after successful payment</li>
            <li>Payment is processed by Razorpay; we do not store card details</li>
            <li>We reserve the right to cancel orders in case of pricing errors or stock unavailability; full refunds will be issued</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl text-fluno-ink mb-3">4. Intellectual Property</h2>
          <p>All content on this site — including the Fluno name, logo, product descriptions, and imagery — is owned by Parvar Enterprise. Unauthorised reproduction is prohibited.</p>
        </section>

        <section>
          <h2 className="font-display text-xl text-fluno-ink mb-3">5. Limitation of Liability</h2>
          <p>Our liability for any claim is limited to the value of your order. We are not liable for indirect, incidental, or consequential damages. Nothing in these terms affects your statutory rights as a consumer under Indian law.</p>
        </section>

        <section>
          <h2 className="font-display text-xl text-fluno-ink mb-3">6. Governing Law</h2>
          <p>These terms are governed by the laws of India. Disputes shall be subject to the jurisdiction of courts in Hyderabad, Telangana.</p>
        </section>

        <section>
          <h2 className="font-display text-xl text-fluno-ink mb-3">7. Contact</h2>
          <p>Parvar Enterprise · Hyderabad, India 500090<br />
          <a href="mailto:contact@myfluno.com" className="text-fluno-teal hover:underline">contact@myfluno.com</a></p>
        </section>
      </div>
    </div>
  );
}
