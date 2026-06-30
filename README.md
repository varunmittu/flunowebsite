# Fluno Website

Mid-premium personal care & hygiene D2C brand — **myfluno.com**

Built with Next.js 14 · Tailwind CSS · TypeScript · Framer Motion

---

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Environment Setup

Copy `.env.local.example` to `.env.local` and fill in your credentials:

```bash
cp .env.local.example .env.local
```

### Required for full functionality

| Variable | Source |
|---|---|
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | [Razorpay Dashboard](https://dashboard.razorpay.com) → Settings → API Keys |
| `RAZORPAY_KEY_SECRET` | Same as above (secret, never expose client-side) |
| `MONGODB_URI` | [MongoDB Atlas](https://cloud.mongodb.com) → Connect → Drivers |
| `NEXTAUTH_SECRET` | Run: `openssl rand -base64 32` |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | [Google Cloud Console](https://console.cloud.google.com) → APIs → Credentials |
| `RESEND_API_KEY` | [Resend](https://resend.com) dashboard |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | [Cloudinary](https://cloudinary.com) dashboard |

---

## Pages

| Route | Description |
|---|---|
| `/` | Homepage — hero, featured products, testimonials, brand story |
| `/shop` | Product listing with filters |
| `/product/[slug]` | Product detail — gallery, ingredients, add to cart |
| `/cart` | Full cart page |
| `/checkout` | 3-step checkout — address → review → payment |
| `/about` | Brand story, team, timeline |
| `/contact` | Contact form + Grievance Officer details |
| `/blog` | Blog listing |
| `/blog/[slug]` | Individual blog post |
| `/login` | Login / Sign up (phone OTP + Google + email) |
| `/account` | Order history, addresses, support |
| `/privacy-policy` | Privacy policy |
| `/terms` | Terms & Conditions |
| `/shipping-policy` | Shipping & delivery |
| `/refund-policy` | Return, refund & exchange |
| `/accessibility` | Accessibility statement |

---

## Products

Real products in `lib/products.ts`:
- **Fluno Hand Wash** — ₹80 / 250ml
- **Fluno Sunscreen SPF 50+ PA++++** — ₹499 / 50g (confirm real price before launch)

---

## Design System

| Token | Value | Use |
|---|---|---|
| `fluno-bg` | #F4F6F5 | Page background |
| `fluno-teal` | #1E5C56 | Primary accent, CTA |
| `fluno-blush` | #E8B69A | Secondary accent |
| `fluno-ink` | #2A2A28 | Body text |
| `fluno-stone` | #D8D5CF | Borders, dividers |

Fonts: **Newsreader** (display) · **Public Sans** (body) · **IBM Plex Mono** (labels/badges)

---

## Deployment (Vercel)

1. Push to GitHub: `git push origin main`
2. Import repo at [vercel.com/new](https://vercel.com/new)
3. Add environment variables in Vercel Dashboard → Project → Settings → Environment Variables
4. Set custom domain `myfluno.com` in Vercel → Domains
5. Update your domain's DNS: add a CNAME pointing to `cname.vercel-dns.com`

---

## What's Stubbed (needs credentials)

- **Razorpay payment** — shows UI but payment won't process without API keys
- **Auth.js login** — UI is live; backend needs `NEXTAUTH_SECRET` + Google OAuth
- **MongoDB** — cart state is client-side; order storage needs `MONGODB_URI`
- **Newsletter API** — endpoint at `/api/newsletter` ready; add Resend integration

---

## Legal

All 5 legal pages are live starter drafts based on:
- Consumer Protection (E-Commerce) Rules, 2020
- Digital Personal Data Protection Act (DPDP), 2023

**Have a lawyer review before going fully live.**

---

© 2025 Parvar Enterprise · Hyderabad, India
