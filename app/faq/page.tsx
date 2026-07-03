import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about Fluno products, shipping, returns, and payments.",
};

const SECTIONS: { title: string; faqs: { q: string; a: string }[] }[] = [
  {
    title: "Orders & Shipping",
    faqs: [
      {
        q: "How long does delivery take?",
        a: "Orders are dispatched within 1–2 business days. Delivery takes 2–3 days in Telangana, 3–5 days in metro cities, and 5–7 days across the rest of India. Remote areas may take up to 10 days. These are estimates — see our Shipping Policy for details.",
      },
      {
        q: "Is shipping free?",
        a: "Yes — shipping is free on all orders of ₹499 and above. Orders below ₹499 carry a flat ₹49 shipping charge.",
      },
      {
        q: "How do I track my order?",
        a: "Once your order ships, you'll receive an email with the courier name, tracking ID, and a tracking link. You can also see your order status anytime in your Account page.",
      },
      {
        q: "Can I cancel my order?",
        a: "Yes, free of charge — as long as it hasn't been dispatched yet. Email contact@myfluno.com with your order ID. Once dispatched, cancellation isn't possible, but you can use our return process.",
      },
      {
        q: "Do you ship internationally?",
        a: "Not yet — we currently ship within India only.",
      },
    ],
  },
  {
    title: "Returns & Refunds",
    faqs: [
      {
        q: "What is your return policy?",
        a: "Unopened products in original sealed packaging can be returned within 7 days of delivery. Opened or used products cannot be returned for hygiene reasons, unless they're defective. Damaged, defective, or incorrect items must be reported within 48 hours of delivery.",
      },
      {
        q: "How do I report a damaged product?",
        a: "Raise a support ticket at myfluno.com/support within 48 hours of delivery, then upload clear photos of the damaged product, packaging, and shipping label directly in the ticket chat — this is mandatory for the claim to be processed.",
      },
      {
        q: "When will I get my refund?",
        a: "Approved refunds are processed within 5–7 business days after we receive and inspect the returned product, credited to your original payment method. Your bank may take a few additional days to post it.",
      },
      {
        q: "Do I get a GST invoice?",
        a: "Yes — a download link for your GST invoice is included in your order confirmation email.",
      },
    ],
  },
  {
    title: "Payments",
    faqs: [
      {
        q: "What payment methods do you accept?",
        a: "We accept UPI, credit/debit cards, net banking, and popular wallets — all processed securely through Razorpay. We never see or store your card details.",
      },
      {
        q: "Do you offer Cash on Delivery?",
        a: "Not at the moment — all orders are prepaid. We're working on adding COD soon.",
      },
      {
        q: "How do I use a coupon code?",
        a: "Enter your coupon code in the \"Coupon code\" box in the Order Summary at checkout and click Apply. The discount is reflected immediately in your total.",
      },
      {
        q: "My payment failed but money was deducted. What now?",
        a: "Don't worry — failed payments are automatically refunded by your bank within 5–7 business days. If it doesn't arrive, contact us with your payment reference and we'll chase it with Razorpay.",
      },
    ],
  },
  {
    title: "Products",
    faqs: [
      {
        q: "Are Fluno products safe for sensitive skin?",
        a: "Our formulas are made to be gentle and we avoid unnecessary harsh chemicals. That said, everyone's skin is different — always do a patch test before first use, and check the full ingredient list (printed on every pack and listed on each product page) for known allergens.",
      },
      {
        q: "Are your products tested on animals?",
        a: "No. Fluno products are not tested on animals.",
      },
      {
        q: "What's the shelf life of your products?",
        a: "Each product carries its manufacturing date and best-before period on the pack. As a rule of thumb, use within the period-after-opening (PAO) indicated on the label for best results.",
      },
      {
        q: "Where are Fluno products made?",
        a: "Fluno products are formulated and made in India.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <p className="font-fig-body text-xs text-fig-terracotta uppercase tracking-widest mb-2">Help Center</p>
      <h1 className="font-fig font-bold text-3xl md:text-4xl text-fig-navy leading-tight mb-3">Frequently Asked Questions</h1>
      <p className="font-fig-body text-fig-navy/55 mb-12">
        Quick answers to the questions we get most. Can&apos;t find yours?{" "}
        <Link href="/support" className="text-fig-terracotta hover:underline">Raise a support ticket</Link>{" "}
        or email{" "}
        <a href="mailto:contact@myfluno.com" className="text-fig-terracotta hover:underline">contact@myfluno.com</a>.
      </p>

      <div className="space-y-10">
        {SECTIONS.map((section) => (
          <section key={section.title}>
            <h2 className="font-fig font-bold text-lg font-semibold text-fig-navy mb-4">{section.title}</h2>
            <div className="space-y-2.5">
              {section.faqs.map((faq) => (
                <details
                  key={faq.q}
                  className="group bg-white border border-fig-sage/60 rounded-xl overflow-hidden hover:border-fig-terracotta/30 transition-colors"
                >
                  <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer list-none font-fig-body text-sm font-medium text-fig-navy [&::-webkit-details-marker]:hidden">
                    {faq.q}
                    <span className="text-fig-terracotta text-lg leading-none group-open:rotate-45 transition-transform flex-shrink-0">+</span>
                  </summary>
                  <p className="px-5 pb-4 font-fig-body text-sm text-fig-navy/60 leading-relaxed">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-14 p-6 bg-fig-terracotta/5 border border-fig-terracotta/20 rounded-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="font-fig-body text-xs text-fig-terracotta uppercase tracking-widest mb-1">Still stuck?</p>
          <p className="font-fig-body text-sm text-fig-navy/70">Our support team replies within 24 hours, Mon–Sat.</p>
        </div>
        <Link href="/support" className="fig-btn whitespace-nowrap shrink-0">Get Support</Link>
      </div>
    </div>
  );
}
