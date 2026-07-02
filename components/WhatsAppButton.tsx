"use client";

import { usePathname } from "next/navigation";

const NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER; // e.g. 919876543210 (country code, no + or spaces)

export default function WhatsAppButton() {
  const pathname = usePathname();

  if (!NUMBER) return null;
  if (pathname.startsWith("/admin") || pathname.startsWith("/checkout")) return null;

  const href = `https://wa.me/${NUMBER}?text=${encodeURIComponent("Hi Fluno! I have a question.")}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-5 left-5 z-[997] w-13 h-13 rounded-full shadow-lg hover:scale-105 transition-transform"
      style={{ width: 52, height: 52, background: "#25D366", display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <svg viewBox="0 0 32 32" width="28" height="28" fill="#fff" aria-hidden="true">
        <path d="M16 3C9.373 3 4 8.373 4 15c0 2.395.7 4.62 1.9 6.494L4.06 27.94l6.6-1.807A11.94 11.94 0 0 0 16 27c6.627 0 12-5.373 12-12S22.627 3 16 3zm0 21.75a9.7 9.7 0 0 1-4.95-1.35l-.355-.21-3.675 1.005.985-3.585-.23-.37A9.7 9.7 0 0 1 6.25 15c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75zm5.35-7.3c-.295-.148-1.745-.86-2.015-.958-.27-.098-.467-.147-.663.148-.196.295-.762.957-.934 1.154-.172.196-.344.22-.639.073-.295-.147-1.245-.459-2.372-1.463-.877-.782-1.469-1.748-1.641-2.043-.172-.295-.018-.454.13-.601.132-.132.294-.344.442-.516.147-.172.196-.295.294-.492.098-.196.05-.368-.024-.516-.074-.147-.663-1.598-.909-2.188-.239-.574-.482-.497-.663-.506l-.564-.01c-.196 0-.516.074-.786.369-.27.294-1.031 1.008-1.031 2.458s1.056 2.851 1.203 3.048c.147.196 2.077 3.17 5.032 4.446.703.303 1.252.485 1.68.62.706.225 1.348.193 1.856.117.566-.084 1.745-.713 1.99-1.402.246-.688.246-1.278.172-1.401-.073-.123-.27-.196-.564-.344z"/>
      </svg>
    </a>
  );
}
