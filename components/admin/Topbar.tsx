"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, ShieldCheck } from "lucide-react";

function getTitle(path: string): string {
  if (path.match(/\/admin\/products\/.+\/edit/)) return "Edit Product";
  if (path.match(/\/admin\/blog\/.+\/edit/))     return "Edit Post";
  if (path.match(/\/admin\/orders\/[^/]+$/))     return "Order Details";
  if (path.startsWith("/admin/products/new"))    return "New Product";
  if (path.startsWith("/admin/blog/new"))        return "New Blog Post";
  if (path.startsWith("/admin/dashboard"))       return "Dashboard";
  if (path.startsWith("/admin/products"))        return "Products";
  if (path.startsWith("/admin/orders"))          return "Orders";
  if (path.startsWith("/admin/tickets"))         return "Support Tickets";
  if (path.startsWith("/admin/blog"))            return "Blog Posts";
  if (path.startsWith("/admin/coupons"))         return "Coupons";
  if (path.startsWith("/admin/categories"))      return "Categories";
  if (path.startsWith("/admin/drive-setup"))     return "Drive Setup";
  return "Admin";
}

export default function Topbar() {
  const path = usePathname();
  if (path === "/admin/login" || path === "/admin") return null;

  return (
    <header
      className="sticky top-0 z-30 h-14 flex items-center justify-between px-6 border-b border-white/[0.06] flex-shrink-0"
      style={{ background: "rgba(17,21,39,0.88)", backdropFilter: "blur(16px)" }}
    >
      {/* Left */}
      <div className="flex items-center gap-2 min-w-0">
        <span className="hidden sm:block font-mono text-[9px] text-white/[0.16] tracking-[0.2em] uppercase">
          FLUNO /
        </span>
        <h1 className="font-fig font-bold text-sm font-semibold text-white/90 truncate">
          {getTitle(path)}
        </h1>
      </div>

      {/* Right */}
      <div className="flex items-center gap-1">
        <Link
          href="/"
          target="_blank"
          className="hidden sm:flex items-center gap-1.5 font-mono text-[11px] text-white/[0.28] hover:text-white/60 px-3 py-1.5 rounded-lg hover:bg-white/[0.05] transition-all"
        >
          View Site <ExternalLink size={10} />
        </Link>
        <div className="ml-2 pl-3 border-l border-white/[0.07] flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-fig-terracotta/20 border border-fig-terracotta/25 flex items-center justify-center">
            <ShieldCheck size={13} className="text-fig-terracotta/75" />
          </div>
          <span className="hidden md:block font-mono text-[10px] text-white/[0.28]">Admin</span>
        </div>
      </div>
    </header>
  );
}
