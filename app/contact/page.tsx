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
    <div className="reveal max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid lg:grid-cols-2 gap-14">
        {/* Left Info */}
        <div>
          <p className="font-fig-body text-xs tracking-widest text-fig-terracotta uppercase mb-3">
            Get in Touch
          </p>
          <h1 className="font-fig font-bold text-3xl md:text-4xl text-fig-navy leading-tight mb-4">We&apos;d love to hear from you.</h1>
          <p className="font-fig-body text-fig-navy/60 leading-relaxed mb-10">
            Questions about a product, an order, or just want to say hello?
            We&apos;re a small team and we actually read every message.
          </p>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-fig-terracotta/10 rounded-sm flex items-center justify-center flex-shrink-0">
                <Mail size={18} className="text-fig-terracotta" />
              </div>
              <div>
                <p className="font-fig-body text-sm font-medium text-fig-navy">Email</p>
                <a
                  href="mailto:contact@myfluno.com"
                  className="font-fig-body text-sm text-fig-terracotta hover:underline"
                >
                  contact@myfluno.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-fig-terracotta/10 rounded-sm flex items-center justify-center flex-shrink-0">
                <MapPin size={18} className="text-fig-terracotta" />
              </div>
              <div>
                <p className="font-fig-body text-sm font-medium text-fig-navy">Address</p>
                <p className="font-fig-body text-sm text-fig-navy/60">
                  Parvar Enterprises
                  <br />
                  India
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-fig-terracotta/10 rounded-sm flex items-center justify-center flex-shrink-0">
                <Clock size={18} className="text-fig-terracotta" />
              </div>
              <div>
                <p className="font-fig-body text-sm font-medium text-fig-navy">Response Time</p>
                <p className="font-fig-body text-sm text-fig-navy/60">
                  We aim to respond within 24–48 hours on business days.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-fig-terracotta/10 rounded-sm flex items-center justify-center flex-shrink-0">
                <Instagram size={18} className="text-fig-terracotta" />
              </div>
              <div>
                <p className="font-fig-body text-sm font-medium text-fig-navy">Social</p>
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
                      className="font-fig-body text-xs text-fig-terracotta hover:underline"
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
        <div className="bg-fig-paper border border-fig-navy/10 rounded-2xl p-8">
          <h2 className="font-fig font-bold text-xl text-fig-navy mb-6">
            Send us a message
          </h2>
          <ContactForm />
        </div>
      </div>

      {/* Support Ticket CTA */}
      <div className="mt-14 p-6 bg-fig-terracotta/5 border border-fig-terracotta/20 rounded-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="font-fig-body text-xs text-fig-terracotta uppercase tracking-widest mb-1">
            Need help with an order or product?
          </p>
          <p className="font-fig-body text-sm text-fig-navy/70">
            Raise a support ticket and our team will get back to you within 24–48 hours.
          </p>
        </div>
        <a
          href="/support"
          className="fig-btn whitespace-nowrap shrink-0"
        >
          Raise a Ticket
        </a>
      </div>
    </div>
  );
}
