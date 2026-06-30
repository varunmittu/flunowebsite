"use client";

export default function ContactForm() {
  return (
    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block font-body text-sm text-fluno-ink/70 mb-1">
            Name
          </label>
          <input className="input" placeholder="Your name" />
        </div>
        <div>
          <label className="block font-body text-sm text-fluno-ink/70 mb-1">
            Email
          </label>
          <input type="email" className="input" placeholder="your@email.com" />
        </div>
      </div>
      <div>
        <label className="block font-body text-sm text-fluno-ink/70 mb-1">
          Subject
        </label>
        <select className="input">
          <option>Order Enquiry</option>
          <option>Product Question</option>
          <option>Return / Refund</option>
          <option>Feedback</option>
          <option>Other</option>
        </select>
      </div>
      <div>
        <label className="block font-body text-sm text-fluno-ink/70 mb-1">
          Message
        </label>
        <textarea
          rows={5}
          className="input resize-none"
          placeholder="How can we help you?"
        />
      </div>
      <button type="submit" className="btn-primary w-full">
        Send Message
      </button>
    </form>
  );
}
