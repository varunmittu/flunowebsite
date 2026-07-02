import type { Metadata } from "next";
import { Mail, MapPin, Instagram, Clock } from "lucide-react";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Fluno — we'd love to hear from you. Email us at contact@myfluno.com.",
};

export default function ContactPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid lg:grid-cols-2 gap-14">
        {/* Left Info */}
        <div>
          <p className="font-mono text-xs tracking-widest text-fluno-teal uppercase mb-3">
            Get in Touch
          </p>
          <h1 className="section-title mb-4">We&apos;d love to hear from you.</h1>
          <p className="font-body text-fluno-ink/60 leading-relaxed mb-10">
            Questions about a product, an order, or just want to say hello?
            We&apos;re a small team and we actually read every message.
          </p>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-fluno-teal/10 rounded-sm flex items-center justify-center flex-shrink-0">
                <Mail size={18} className="text-fluno-teal" />
              </div>
              <div>
                <p className="font-body text-sm font-medium text-fluno-ink">Email</p>
                <a
                  href="mailto:contact@myfluno.com"
                  className="font-mono text-sm text-fluno-teal hover:underline"
                >
                  contact@myfluno.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-fluno-teal/10 rounded-sm flex items-center justify-center flex-shrink-0">
                <MapPin size={18} className="text-fluno-teal" />
              </div>
              <div>
                <p className="font-body text-sm font-medium text-fluno-ink">Address</p>
                <p className="font-body text-sm text-fluno-ink/60">
                  Parvar Enterprises
                  <br />
                  India
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-fluno-teal/10 rounded-sm flex items-center justify-center flex-shrink-0">
                <Clock size={18} className="text-fluno-teal" />
              </div>
              <div>
                <p className="font-body text-sm font-medium text-fluno-ink">Response Time</p>
                <p className="font-body text-sm text-fluno-ink/60">
                  We aim to respond within 24–48 hours on business days.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-fluno-teal/10 rounded-sm flex items-center justify-center flex-shrink-0">
                <Instagram size={18} className="text-fluno-teal" />
              </div>
              <div>
                <p className="font-body text-sm font-medium text-fluno-ink">Social</p>
                <div className="flex gap-4 mt-1">
                  {[
                    { label: "@myfluno", href: "https://instagram.com/myfluno" },
                    { label: "Threads", href: "https://threads.net/@myfluno" },
                    { label: "Facebook", href: "https://facebook.com" },
                    { label: "YouTube", href: "https://youtube.com" },
                  ].map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-xs text-fluno-teal hover:underline"
                    >
                      {s.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="card p-8">
          <h2 className="font-display text-xl text-fluno-ink mb-6">
            Send us a message
          </h2>
          <ContactForm />
        </div>
      </div>

      {/* Support Ticket CTA */}
      <div className="mt-14 p-6 bg-fluno-teal/5 border border-fluno-teal/20 rounded-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="font-mono text-xs text-fluno-teal uppercase tracking-widest mb-1">
            Need help with an order or product?
          </p>
          <p className="font-body text-sm text-fluno-ink/70">
            Raise a support ticket and our team will get back to you within 24–48 hours.
          </p>
        </div>
        <a
          href="/support"
          className="btn-primary whitespace-nowrap shrink-0"
        >
          Raise a Ticket
        </a>
      </div>
    </div>
  );
}
