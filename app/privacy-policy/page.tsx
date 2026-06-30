import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Fluno Privacy Policy — how we collect, use, and protect your personal data.",
};

export default function PrivacyPolicy() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <p className="font-mono text-xs text-fluno-teal uppercase tracking-widest mb-2">Legal</p>
      <h1 className="section-title mb-2">Privacy Policy</h1>
      <p className="font-mono text-xs text-fluno-ink/40 mb-10">Last updated: June 2025 · Parvar Enterprise (Fluno)</p>

      <div className="prose prose-sm max-w-none font-body text-fluno-ink/80 space-y-8">
        <section>
          <h2 className="font-display text-xl text-fluno-ink mb-3">1. Who We Are</h2>
          <p>Fluno is a brand operated by <strong>Parvar Enterprise</strong>, based in Hyderabad, India. We operate the website myfluno.com and sell personal care products. For data-related queries, contact us at <a href="mailto:contact@myfluno.com" className="text-fluno-teal hover:underline">contact@myfluno.com</a>.</p>
        </section>

        <section>
          <h2 className="font-display text-xl text-fluno-ink mb-3">2. What Data We Collect</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Account data:</strong> name, email, phone number when you register</li>
            <li><strong>Order data:</strong> delivery address, order history, payment reference IDs (we do not store full card numbers)</li>
            <li><strong>Usage data:</strong> pages visited, browser type, device type, IP address (via analytics)</li>
            <li><strong>Communications:</strong> messages you send us via contact form or email</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl text-fluno-ink mb-3">3. How We Use Your Data</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>To process and deliver your orders</li>
            <li>To send order confirmations and shipping updates</li>
            <li>To respond to your customer service queries</li>
            <li>To send marketing emails <strong>only if you have opted in</strong> (no pre-ticked boxes)</li>
            <li>To improve our website and product offerings through anonymised analytics</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl text-fluno-ink mb-3">4. Legal Basis</h2>
          <p>We process your data under the <strong>Digital Personal Data Protection Act (DPDP), 2023</strong> on the basis of your consent and for the performance of a contract (your order). We collect only what is necessary.</p>
        </section>

        <section>
          <h2 className="font-display text-xl text-fluno-ink mb-3">5. Your Rights</h2>
          <p>Under DPDP 2023, you have the right to:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Access the personal data we hold about you</li>
            <li>Correct inaccurate data</li>
            <li>Withdraw consent for marketing communications at any time</li>
            <li>Request deletion of your account and associated data</li>
          </ul>
          <p className="mt-3">To exercise any of these rights, email <a href="mailto:contact@myfluno.com" className="text-fluno-teal hover:underline">contact@myfluno.com</a>.</p>
        </section>

        <section>
          <h2 className="font-display text-xl text-fluno-ink mb-3">6. Data Sharing</h2>
          <p>We share your data with:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Razorpay</strong> — to process payments</li>
            <li><strong>Courier partners</strong> — to deliver your orders</li>
            <li><strong>Cloud providers</strong> (MongoDB Atlas, Vercel, Cloudinary) — to operate our services</li>
          </ul>
          <p className="mt-3">We do not sell your personal data to third parties.</p>
        </section>

        <section>
          <h2 className="font-display text-xl text-fluno-ink mb-3">7. Data Retention</h2>
          <p>We retain order data for 7 years as required by Indian accounting and tax law. Account data is retained until you request deletion. Marketing preferences are respected immediately upon withdrawal.</p>
        </section>

        <section>
          <h2 className="font-display text-xl text-fluno-ink mb-3">8. Contact</h2>
          <p>For privacy concerns or to exercise your rights:<br />
          <strong>Grievance Officer:</strong> Avinash Mohan V<br />
          <strong>Email:</strong> <a href="mailto:contact@myfluno.com" className="text-fluno-teal hover:underline">contact@myfluno.com</a><br />
          <strong>Address:</strong> Hyderabad, India 500090</p>
        </section>
      </div>
    </div>
  );
}
