import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accessibility Statement",
  description: "Fluno accessibility commitment and statement.",
};

export default function Accessibility() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <p className="font-fig-body text-xs text-fig-terracotta uppercase tracking-widest mb-2">Legal</p>
      <h1 className="font-fig font-bold text-3xl md:text-4xl text-fig-navy leading-tight mb-2">Accessibility Statement</h1>
      <p className="font-fig-body text-xs text-fig-navy/40 mb-10">Last updated: June 2025</p>

      <div className="prose prose-sm max-w-none font-fig-body text-fig-navy/80 space-y-8">
        <section className="reveal">
          <h2 className="font-fig font-bold text-xl text-fig-navy mb-3">Our Commitment</h2>
          <p>Fluno is committed to making myfluno.com accessible to all users, including those with disabilities. We aim to conform to the <strong>Web Content Accessibility Guidelines (WCAG) 2.1 Level AA</strong>.</p>
        </section>

        <section className="reveal">
          <h2 className="font-fig font-bold text-xl text-fig-navy mb-3">What We Do</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Use semantic HTML for screen reader compatibility</li>
            <li>Provide alt text for all product images</li>
            <li>Ensure keyboard navigability throughout the site</li>
            <li>Maintain sufficient colour contrast ratios (minimum 4.5:1 for body text)</li>
            <li>Use visible focus indicators for keyboard users</li>
            <li>Avoid auto-playing audio or video</li>
          </ul>
        </section>

        <section className="reveal">
          <h2 className="font-fig font-bold text-xl text-fig-navy mb-3">Known Limitations</h2>
          <p>We are a small team and are continuously improving. Some third-party components (such as payment gateways) may not fully conform to WCAG standards — these are managed by their respective providers.</p>
        </section>

        <section className="reveal">
          <h2 className="font-fig font-bold text-xl text-fig-navy mb-3">Feedback</h2>
          <p>If you experience any accessibility barriers on our site, please contact us:</p>
          <p><strong>Email:</strong> <a href="mailto:contact@myfluno.com" className="text-fig-terracotta hover:underline">contact@myfluno.com</a><br />
          We aim to respond within 5 business days.</p>
        </section>
      </div>
    </div>
  );
}
