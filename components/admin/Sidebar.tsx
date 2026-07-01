"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Package, ShoppingBag, FileText,
  Tag, FolderOpen, LogOut, Sparkles, X, Menu, HardDrive,
} from "lucide-react";
import { useState } from "react";

const nav = [
  { label: "Dashboard",   href: "/admin/dashboard",   icon: LayoutDashboard },
  { label: "Products",    href: "/admin/products",    icon: Package          },
  { label: "Orders",      href: "/admin/orders",      icon: ShoppingBag      },
  { label: "Blog",        href: "/admin/blog",        icon: FileText         },
  { label: "Coupons",     href: "/admin/coupons",     icon: Tag              },
  { label: "Categories",  href: "/admin/categories",  icon: FolderOpen       },
  { label: "Drive Setup", href: "/admin/drive-setup", icon: HardDrive        },
];

export default function Sidebar() {
  const path   = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function handleLogout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/10">
        <Link href="/admin/dashboard" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <Sparkles size={16} className="text-fluno-purple" />
          <span className="font-brand font-bold text-2xl text-white text-glow">fluno</span>
        </Link>
        <p className="font-mono text-[10px] text-fluno-purple/60 mt-0.5 tracking-widest">ADMIN PANEL</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        {nav.map(({ label, href, icon: Icon }) => {
          const active = path.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-body font-medium transition-all duration-200 ${
                active
                  ? "bg-fluno-purple/20 text-fluno-purple border border-fluno-purple/30"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon size={18} />
              {label}
              {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-fluno-purple" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 pb-6 border-t border-white/10 pt-4">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs text-white/30 hover:text-white/60 transition-colors mb-1"
        >
          View Live Site ↗
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-white/50 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
        >
          <LogOut size={18} />
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
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 bg-fluno-dark border border-white/10 rounded-xl text-white/60"
      >
        <Menu size={20} />
      </button>

      {/* Mobile overlay */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`lg:hidden fixed left-0 top-0 h-full w-64 z-50 bg-fluno-dark border-r border-white/10 transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 p-2 text-white/40 hover:text-white"
        >
          <X size={18} />
        </button>
        <SidebarContent />
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 flex-shrink-0 bg-fluno-dark border-r border-white/10 min-h-screen sticky top-0">
        <SidebarContent />
      </aside>
    </>
  );
}
