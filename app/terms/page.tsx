import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Fluno Terms and Conditions of sale and use.",
};

export default function Terms() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <p className="font-fig-body text-xs text-fig-terracotta uppercase tracking-widest mb-2">Legal</p>
      <h1 className="font-fig font-bold text-3xl md:text-4xl text-fig-navy leading-tight mb-2">Terms &amp; Conditions</h1>
      <p className="font-fig-body text-xs text-fig-navy/40 mb-10">Last updated: July 2026 · Parvar Enterprise (Fluno)</p>

      <div className="prose prose-sm max-w-none font-fig-body text-fig-navy/80 space-y-8">
        <section className="reveal">
          <h2 className="font-fig font-bold text-xl text-fig-navy mb-3">1. Agreement &amp; Eligibility</h2>
          <p>These Terms constitute a legally binding agreement between you and <strong>Parvar Enterprise</strong> (&ldquo;Company&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;), owner and operator of the Fluno brand and myfluno.com (the &ldquo;Platform&rdquo;). By accessing the Platform, creating an account, or placing an order, you accept these Terms in full. You must be at least 18 years of age and competent to contract under the Indian Contract Act, 1872. We may revise these Terms at any time; continued use after revision constitutes acceptance.</p>
        </section>

        <section className="reveal">
          <h2 className="font-fig font-bold text-xl text-fig-navy mb-3">2. Account &amp; Registration</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>You agree to provide accurate, current, and complete information and keep it updated</li>
            <li>You are solely responsible for maintaining the confidentiality of your credentials and for all activity under your account</li>
            <li>We may suspend or terminate any account, refuse service, or cancel orders at our sole discretion, including for suspected fraud, abuse, resale activity, or breach of these Terms</li>
          </ul>
        </section>

        <section className="reveal">
          <h2 className="font-fig font-bold text-xl text-fig-navy mb-3">3. Consent to Communications &amp; Data Use</h2>
          <p>By registering on the Platform or providing your email address or phone number, you expressly consent to receive transactional, promotional, and advertising communications from us and our partners via email, SMS, WhatsApp, RCS, phone call, and browser push notification — including where your numbers are registered on DND/NCPR — and you consent to the collection, use, sharing, and commercial disclosure of your contact data as described in our <a href="/privacy-policy" className="text-fig-terracotta hover:underline">Privacy Policy</a>, which forms an integral part of these Terms. You may opt out of marketing at any time as described therein.</p>
        </section>

        <section className="reveal">
          <h2 className="font-fig font-bold text-xl text-fig-navy mb-3">4. Products, Pricing &amp; Availability</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>All prices are in Indian Rupees (₹) and include GST unless stated otherwise</li>
            <li>Product images, shades, and packaging are representative only; minor variations may occur</li>
            <li>We may change prices, discontinue products, or limit quantities at any time without notice</li>
            <li><strong>Pricing errors:</strong> If a product is listed at an incorrect price or with incorrect information due to typographical, technical, or system error, we reserve the right to cancel the order — whether or not payment has been received — with a full refund of the amount paid as your sole and exclusive remedy</li>
            <li>We may impose per-customer quantity limits and refuse orders that we reasonably believe are for commercial resale</li>
          </ul>
        </section>

        <section className="reveal">
          <h2 className="font-fig font-bold text-xl text-fig-navy mb-3">5. Orders &amp; Payment</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Your order is an offer to purchase; a contract is formed only when we dispatch the products</li>
            <li>Payment is processed by Razorpay; we do not store full card details</li>
            <li>We may cancel any order prior to dispatch for reasons including stock unavailability, pricing error, address serviceability, or suspected fraud; our sole liability is a refund of the amount paid</li>
            <li>Initiating a chargeback for a transaction that complies with these Terms constitutes a breach; we reserve the right to contest it, recover costs, and suspend your account</li>
          </ul>
        </section>

        <section className="reveal">
          <h2 className="font-fig font-bold text-xl text-fig-navy mb-3">6. Product Use &amp; Safety Disclaimer</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Our products are cosmetic and hygiene products for <strong>external use only</strong> and are not intended to diagnose, treat, cure, or prevent any disease or medical condition</li>
            <li><strong>Perform a patch test before first use.</strong> Discontinue use immediately if irritation, redness, or discomfort occurs and consult a physician</li>
            <li>Individual results vary; testimonials and reviews reflect individual experiences and are not a guarantee of outcome</li>
            <li>You are responsible for reviewing the ingredient list for allergens before use; we are not liable for reactions arising from known or unknown sensitivities</li>
            <li>Keep products out of reach of children and away from eyes; store as directed on the label</li>
          </ul>
        </section>

        <section className="reveal">
          <h2 className="font-fig font-bold text-xl text-fig-navy mb-3">7. User Content &amp; Reviews</h2>
          <p>By submitting reviews, ratings, comments, photos, or other content, you grant the Company a perpetual, irrevocable, worldwide, royalty-free, transferable licence to use, reproduce, adapt, publish, and display such content in any media, including for marketing and advertising, without further consent or compensation. You warrant your content is your own, accurate, and lawful. We may edit, refuse, or remove any content at our discretion and without notice.</p>
        </section>

        <section className="reveal">
          <h2 className="font-fig font-bold text-xl text-fig-navy mb-3">8. Intellectual Property</h2>
          <p>All content on the Platform — the Fluno name, logo, formulations, product descriptions, images, design, code, and copy — is owned by or licensed to Parvar Enterprise and protected under Indian intellectual property law. No licence is granted to you except the limited right to browse and purchase for personal use. Any unauthorised reproduction, scraping, data mining, framing, or commercial exploitation is prohibited.</p>
        </section>

        <section className="reveal">
          <h2 className="font-fig font-bold text-xl text-fig-navy mb-3">9. Prohibited Conduct</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Using the Platform for any unlawful purpose or in violation of these Terms</li>
            <li>Purchasing for unauthorised resale or commercial redistribution</li>
            <li>Automated access, scraping, or bulk data extraction</li>
            <li>Posting false reviews, impersonating others, or manipulating ratings</li>
            <li>Abusing return, refund, coupon, or promotional programs</li>
            <li>Interfering with the security or operation of the Platform</li>
          </ul>
        </section>

        <section className="reveal">
          <h2 className="font-fig font-bold text-xl text-fig-navy mb-3">10. Disclaimer &amp; Limitation of Liability</h2>
          <p>The Platform and all content are provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis without warranties of any kind, express or implied, to the maximum extent permitted by law. To the fullest extent permitted by applicable law, the Company&apos;s total aggregate liability arising out of or relating to any order, product, or use of the Platform shall not exceed the amount actually paid by you for the specific order giving rise to the claim. We shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or for loss of profits, data, or goodwill. Nothing in these Terms limits rights that cannot be limited under the Consumer Protection Act, 2019.</p>
        </section>

        <section className="reveal">
          <h2 className="font-fig font-bold text-xl text-fig-navy mb-3">11. Indemnification</h2>
          <p>You agree to indemnify, defend, and hold harmless Parvar Enterprise, its proprietors, employees, and agents from and against any claims, damages, losses, and expenses (including reasonable legal fees) arising out of your breach of these Terms, your misuse of the Platform or products, or your violation of any law or third-party right.</p>
        </section>

        <section className="reveal">
          <h2 className="font-fig font-bold text-xl text-fig-navy mb-3">12. Force Majeure</h2>
          <p>We shall not be liable for any delay or failure to perform resulting from causes beyond our reasonable control, including acts of God, epidemics, strikes, courier or supply-chain disruptions, government action, power or network failures.</p>
        </section>

        <section className="reveal">
          <h2 className="font-fig font-bold text-xl text-fig-navy mb-3">13. Governing Law &amp; Dispute Resolution</h2>
          <p>These Terms are governed by the laws of India. All disputes shall be subject to the <strong>exclusive jurisdiction of the competent courts in Telangana, India</strong>. At the Company&apos;s election, any dispute may first be referred to arbitration by a sole arbitrator appointed by the Company under the Arbitration and Conciliation Act, 1996, seated in Telangana, India, conducted in English.</p>
        </section>

        <section className="reveal">
          <h2 className="font-fig font-bold text-xl text-fig-navy mb-3">14. General</h2>
          <p>If any provision of these Terms is held invalid, the remainder continues in full force. Our failure to enforce any right is not a waiver. These Terms, together with the Privacy Policy, Shipping Policy, and Refund Policy, constitute the entire agreement between you and the Company regarding the Platform.</p>
        </section>

        <section className="reveal">
          <h2 className="font-fig font-bold text-xl text-fig-navy mb-3">15. Contact</h2>
          <p>Parvar Enterprises · India<br />
          <a href="mailto:contact@myfluno.com" className="text-fig-terracotta hover:underline">contact@myfluno.com</a></p>
        </section>
      </div>
    </div>
  );
}
