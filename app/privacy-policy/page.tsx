import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Fluno Privacy Policy — how we collect, use, share, and protect your personal data.",
};

export default function PrivacyPolicy() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <p className="font-fig-body text-xs text-fig-terracotta uppercase tracking-widest mb-2">Legal</p>
      <h1 className="font-fig font-bold text-3xl md:text-4xl text-fig-navy leading-tight mb-2">Privacy Policy</h1>
      <p className="font-fig-body text-xs text-fig-navy/40 mb-10">Last updated: July 2026 · Parvar Enterprise (Fluno)</p>

      <div className="prose prose-sm max-w-none font-fig-body text-fig-navy/80 space-y-8">
        <section>
          <h2 className="font-fig font-bold text-xl text-fig-navy mb-3">1. Who We Are</h2>
          <p>Fluno is a brand owned and operated by <strong>Parvar Enterprises</strong> (&ldquo;Company&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;), India. We operate the website myfluno.com (the &ldquo;Platform&rdquo;) and sell personal care and hygiene products. This Policy is published in accordance with the Information Technology Act, 2000, the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021, and the Digital Personal Data Protection Act, 2023 (&ldquo;DPDP Act&rdquo;).</p>
        </section>

        <section>
          <h2 className="font-fig font-bold text-xl text-fig-navy mb-3">2. Consent</h2>
          <p>By accessing the Platform, creating an account, placing an order, subscribing to our newsletter, submitting a form, or otherwise providing your information to us, you expressly consent to the collection, storage, processing, use, transfer, and disclosure of your personal data as described in this Policy. If you do not agree, please do not use the Platform. You may withdraw consent at any time as described in Section 10; withdrawal does not affect processing carried out before withdrawal.</p>
        </section>

        <section>
          <h2 className="font-fig font-bold text-xl text-fig-navy mb-3">3. Data We Collect</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Identity &amp; contact data:</strong> name, email address, phone number, delivery and billing address</li>
            <li><strong>Account data:</strong> login credentials (passwords are stored hashed), saved addresses, order history</li>
            <li><strong>Transaction data:</strong> order details, payment reference IDs and payment method type (we do not store full card numbers; payments are processed by Razorpay)</li>
            <li><strong>Usage &amp; device data:</strong> pages visited, referral source, session duration, browser and device type, operating system, IP address, and approximate location</li>
            <li><strong>Communications:</strong> messages, reviews, support tickets, chat transcripts, and any content you submit</li>
            <li><strong>Notification data:</strong> push-notification subscription tokens where you have allowed browser notifications</li>
            <li><strong>Cookies and similar technologies:</strong> as described in Section 7</li>
          </ul>
        </section>

        <section>
          <h2 className="font-fig font-bold text-xl text-fig-navy mb-3">4. How We Use Your Data</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>To process, fulfil, and deliver your orders and manage returns and refunds</li>
            <li>To operate, secure, and improve the Platform and our products</li>
            <li>To respond to enquiries, support tickets, and service requests</li>
            <li>To send transactional communications (order confirmations, shipping updates, service notices)</li>
            <li><strong>To send marketing, promotional, and advertising communications</strong> — including product launches, offers, discounts, blog content, and re-engagement campaigns — by email, SMS, WhatsApp, RCS, phone call, and browser push notification</li>
            <li>To build customer profiles, personalise your experience, and show you more relevant products, content, and advertising on and off the Platform</li>
            <li>To conduct analytics, market research, and audience measurement</li>
            <li>To detect and prevent fraud, abuse, and violations of our Terms</li>
            <li>To comply with legal, tax, and regulatory obligations</li>
          </ul>
        </section>

        <section>
          <h2 className="font-fig font-bold text-xl text-fig-navy mb-3">5. Marketing, Advertising &amp; Commercial Use of Contact Data</h2>
          <p>By providing your email address and/or phone number, and subject to your consent obtained at the time of collection, you agree that we may:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Use your email address and phone number for our own <strong>direct marketing and advertising</strong> across email, SMS, WhatsApp, phone, and push channels</li>
            <li><strong>Share, license, or otherwise make available your contact data (email address and phone number) and shopping preferences to third-party marketing partners, advertising networks, and data partners</strong> — including for consideration — so that they may present offers, advertising, and products that may interest you</li>
            <li>Match your contact data with advertising platforms (such as Meta, Google, and similar networks) to build custom and lookalike audiences for our advertising campaigns</li>
            <li>Append, enrich, or combine your data with data lawfully obtained from other sources for the purposes described above</li>
          </ul>
          <p className="mt-3"><strong>Opting out:</strong> You may opt out of marketing communications and of the sharing of your contact data with third parties at any time — by using the unsubscribe link in any email, replying STOP to SMS/WhatsApp, disabling notifications in your browser, or writing to <a href="mailto:contact@myfluno.com" className="text-fig-terracotta hover:underline">contact@myfluno.com</a> with the subject line &ldquo;Opt Out&rdquo;. Transactional communications relating to your orders will continue regardless of marketing preferences.</p>
        </section>

        <section>
          <h2 className="font-fig font-bold text-xl text-fig-navy mb-3">6. Data Sharing</h2>
          <p>In addition to the marketing and advertising partners described in Section 5, we share data with service providers acting on our behalf:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Razorpay</strong> — payment processing</li>
            <li><strong>Courier and logistics partners</strong> — order delivery and tracking</li>
            <li><strong>Cloud and infrastructure providers</strong> (MongoDB Atlas, Vercel, Google) — hosting, storage, and operations</li>
            <li><strong>Email, SMS, and notification providers</strong> — delivery of communications</li>
            <li><strong>Analytics providers</strong> — traffic and behaviour measurement</li>
            <li><strong>Professional advisers, auditors, and government authorities</strong> — where required by law, court order, or to protect our rights</li>
          </ul>
          <p className="mt-3">In the event of a merger, acquisition, restructuring, or sale of all or part of our business or assets, your data may be transferred to the successor entity as part of that transaction.</p>
        </section>

        <section>
          <h2 className="font-fig font-bold text-xl text-fig-navy mb-3">7. Cookies &amp; Tracking Technologies</h2>
          <p>We use cookies, local storage, pixels, and similar technologies to keep you signed in, remember your cart, measure traffic, attribute marketing campaigns, and personalise content and advertising. Third-party advertising partners may set their own cookies through the Platform. You can control cookies through your browser settings; disabling them may limit Platform functionality (including checkout).</p>
        </section>

        <section>
          <h2 className="font-fig font-bold text-xl text-fig-navy mb-3">8. Data Retention</h2>
          <p>We retain personal data for as long as necessary for the purposes described in this Policy or as required by law. Order and transaction records are retained for a minimum of 8 years in line with Indian accounting and tax requirements. Account data is retained until you request deletion. We may retain anonymised or aggregated data indefinitely.</p>
        </section>

        <section>
          <h2 className="font-fig font-bold text-xl text-fig-navy mb-3">9. Security</h2>
          <p>We implement reasonable security practices and procedures, including encryption in transit (HTTPS), hashed password storage, and access controls. However, no method of transmission or storage is completely secure, and we cannot guarantee absolute security. You are responsible for keeping your account credentials confidential.</p>
        </section>

        <section>
          <h2 className="font-fig font-bold text-xl text-fig-navy mb-3">10. Your Rights (DPDP Act, 2023)</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Access a summary of the personal data we hold about you and how it has been processed</li>
            <li>Request correction, completion, or updating of your data</li>
            <li>Request erasure of your data, subject to legal retention requirements</li>
            <li>Withdraw consent at any time (including for marketing and third-party sharing, per Section 5)</li>
            <li>Nominate an individual to exercise your rights in the event of death or incapacity</li>
            <li>Lodge a grievance with us and, if unresolved, escalate to the Data Protection Board of India</li>
          </ul>
          <p className="mt-3">To exercise any of these rights, write to <a href="mailto:contact@myfluno.com" className="text-fig-terracotta hover:underline">contact@myfluno.com</a>. We aim to respond within 30 days.</p>
        </section>

        <section>
          <h2 className="font-fig font-bold text-xl text-fig-navy mb-3">11. Children</h2>
          <p>The Platform is intended for users aged 18 and above. We do not knowingly collect data from children. If you believe a child has provided us data, contact us and we will delete it.</p>
        </section>

        <section>
          <h2 className="font-fig font-bold text-xl text-fig-navy mb-3">12. Changes to This Policy</h2>
          <p>We may update this Policy at any time. The revised version will be posted on this page with an updated date. Your continued use of the Platform after changes are posted constitutes acceptance of the revised Policy. Material changes to how we use contact data for marketing will be notified by email or on-site notice.</p>
        </section>

        <section>
          <h2 className="font-fig font-bold text-xl text-fig-navy mb-3">13. Grievance Officer &amp; Contact</h2>
          <p>In accordance with the Information Technology Act, 2000, the IT Rules 2021, and the DPDP Act 2023:</p>
          <p className="mt-3"><strong>Grievance Officer</strong> — Parvar Enterprise (Fluno)<br />
          <strong>Email:</strong> <a href="mailto:contact@myfluno.com" className="text-fig-terracotta hover:underline">contact@myfluno.com</a> (subject: &ldquo;Grievance&rdquo;)<br />
          <strong>Address:</strong> Parvar Enterprises, India<br />
          Grievances are acknowledged within 48 hours and resolved within 30 days.</p>
        </section>
      </div>
    </div>
  );
}
