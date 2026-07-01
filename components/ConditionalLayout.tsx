"use client";

import { usePathname } from "next/navigation";
import Header     from "@/components/Header";
import Footer     from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const isAdmin = path.startsWith("/admin");

  if (isAdmin) return <>{children}</>;

  return (
    <>
      <Header />
      <CartDrawer />
      <main>{children}</main>
      <Footer />
    </>
  );
}
