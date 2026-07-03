"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Package, ShoppingBag, FileText,
  Tag, FolderOpen, LogOut, X, Menu, HardDrive,
  TicketCheck, ExternalLink, ChevronRight, Inbox,
} from "lucide-react";
import { useState, useEffect } from "react";
import { DoodleSparkle } from "@/components/doodles/Doodles";

const sections = [
  {
    label: "Store",
    items: [
      { label: "Dashboard",  href: "/admin/dashboard",  icon: LayoutDashboard },
      { label: "Products",   href: "/admin/products",   icon: Package          },
      { label: "Orders",     href: "/admin/orders",     icon: ShoppingBag      },
      { label: "Tickets",    href: "/admin/tickets",    icon: TicketCheck      },
      { label: "Messages",   href: "/admin/messages",   icon: Inbox            },
    ],
  },
  {
    label: "Content",
    items: [
      { label: "Blog",       href: "/admin/blog",       icon: FileText         },
      { label: "Coupons",    href: "/admin/coupons",    icon: Tag              },
      { label: "Categories", href: "/admin/categories", icon: FolderOpen       },
    ],
  },
  {
    label: "System",
    items: [
      { label: "Drive Setup", href: "/admin/drive-setup", icon: HardDrive },
    ],
  },
];

const SIDEBAR_BG = "linear-gradient(165deg, #171B2E 0%, #1C2138 55%, #252B42 100%)";

export default function Sidebar() {
  const path   = usePathname();
  const router = useRouter();
  const [open,         setOpen]         = useState(false);
  const [unreadMsgs,   setUnreadMsgs]   = useState(0);

  useEffect(() => {
    fetch("/api/admin/messages?count=1")
      .then((r) => r.json())
      .then((d) => { if (d.count !== undefined) setUnreadMsgs(d.count); })
      .catch(() => {});
  }, []);

  async function handleLogout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full select-none">

      {/* Wordmark */}
      <div className="px-5 pt-6 pb-4">
        <Link
          href="/admin/dashboard"
          onClick={() => setOpen(false)}
          className="flex items-center gap-2.5 group"
        >
          <div className="w-8 h-8 rounded-xl bg-fig-paper border-2 border-fig-navy flex items-center justify-center flex-shrink-0 group-hover:bg-fig-mustard transition-colors">
            <DoodleSparkle className="w-4 h-4 animate-wiggle-slow" tone="coral" />
          </div>
          <div>
            <span className="font-fig font-bold text-xl text-white leading-none block">
              fluno
            </span>
            <span className="font-mono text-[8px] text-fig-terracotta/40 tracking-[0.22em] uppercase">
              Admin
            </span>
          </div>
        </Link>
      </div>

      <div className="mx-4 h-px bg-white/[0.06]" />

      {/* Navigation */}
      <nav className="flex-1 px-2.5 py-4 overflow-y-auto space-y-4">
        {sections.map((sec) => (
          <div key={sec.label}>
            <p className="px-3 mb-1.5 font-mono text-[9px] text-white/[0.2] uppercase tracking-[0.2em]">
              {sec.label}
            </p>

            <div className="space-y-0.5">
              {sec.items.map(({ label, href, icon: Icon }) => {
                const active = path === href || (href !== "/admin/dashboard" && path.startsWith(href));
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setOpen(false)}
                    className={`relative flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-fig-body font-medium transition-all duration-150 group ${
                      active
                        ? "bg-fig-terracotta/[0.12] text-white"
                        : "text-white/[0.36] hover:text-white/70 hover:bg-white/[0.05]"
                    }`}
                  >
                    {active && (
                      <span className="absolute left-0 top-[22%] bottom-[22%] w-[2.5px] bg-fig-terracotta rounded-r-full" />
                    )}
                    <Icon
                      size={15}
                      className={
                        active
                          ? "text-fig-terracotta flex-shrink-0"
                          : "text-white/[0.25] group-hover:text-white/55 flex-shrink-0 transition-colors"
                      }
                    />
                    <span className="flex-1 leading-none">{label}</span>
                    {label === "Messages" && unreadMsgs > 0 && (
                      <span className="ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-fig-terracotta/25 text-fig-terracotta border border-fig-terracotta/30 leading-none flex-shrink-0">
                        {unreadMsgs}
                      </span>
                    )}
                    {active && (
                      <ChevronRight size={11} className="text-fig-terracotta/40 flex-shrink-0" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-2.5 pb-4">
        <div className="mx-0.5 mb-3 h-px bg-white/[0.06]" />
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-white/[0.22] hover:text-white/50 hover:bg-white/[0.04] transition-all"
        >
          <ExternalLink size={13} className="flex-shrink-0" />
          View Live Site
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] text-white/[0.32] hover:text-red-400 hover:bg-red-500/[0.07] transition-all"
        >
          <LogOut size={15} className="flex-shrink-0" />
          Log Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden fixed top-3.5 left-4 z-50 p-2 rounded-xl text-white/50 border border-white/[0.1] hover:border-white/[0.2] transition-colors"
        style={{ background: "rgba(17,21,39,0.92)" }}
        aria-label="Open menu"
      >
        <Menu size={18} />
      </button>

      {/* Mobile overlay */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`lg:hidden fixed left-0 top-0 h-full w-60 z-50 border-r border-white/[0.06] transition-transform duration-200 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ background: SIDEBAR_BG }}
      >
        <button
          onClick={() => setOpen(false)}
          className="absolute top-4 right-3.5 p-1.5 text-white/25 hover:text-white/60 transition-colors"
          aria-label="Close menu"
        >
          <X size={15} />
        </button>
        <SidebarContent />
      </aside>

      {/* Desktop sidebar */}
      <aside
        className="hidden lg:flex flex-col w-60 flex-shrink-0 border-r border-white/[0.06] min-h-screen sticky top-0"
        style={{ background: SIDEBAR_BG }}
      >
        <SidebarContent />
      </aside>
    </>
  );
}
