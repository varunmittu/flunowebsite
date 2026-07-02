import type { Metadata } from "next";
import Sidebar from "@/components/admin/Sidebar";
import Topbar  from "@/components/admin/Topbar";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | Fluno Admin" },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen" style={{ background: "#080510" }}>
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
