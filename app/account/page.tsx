import type { Metadata } from "next";
import Link from "next/link";
import { Package, MapPin, Ticket, LogOut, User } from "lucide-react";

export const metadata: Metadata = {
  title: "My Account",
  description: "Manage your Fluno orders, addresses, and account details.",
};

const orders = [
  {
    id: "FLN-2025-001",
    date: "June 15, 2025",
    items: "Fluno Hand Wash × 2",
    total: 160,
    status: "Delivered",
  },
  {
    id: "FLN-2025-002",
    date: "June 25, 2025",
    items: "Fluno Hand Wash × 1, Sunscreen SPF 50+ × 1",
    total: 579,
    status: "In Transit",
  },
];

export default function AccountPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="card p-6 mb-4">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-full bg-fluno-teal/10 flex items-center justify-center">
                <User size={22} className="text-fluno-teal" />
              </div>
              <div>
                <p className="font-display text-base text-fluno-ink">My Account</p>
                <p className="font-mono text-xs text-fluno-ink/40">
                  contact@myfluno.com
                </p>
              </div>
            </div>
            <nav className="space-y-1">
              {[
                { icon: Package, label: "Orders", href: "#orders" },
                { icon: MapPin, label: "Addresses", href: "#addresses" },
                { icon: Ticket, label: "Support", href: "#support" },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-body text-fluno-ink/70 hover:bg-fluno-stone/30 hover:text-fluno-teal transition-colors"
                >
                  <item.icon size={16} />
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
          <button className="flex items-center gap-2 text-sm font-body text-fluno-ink/40 hover:text-red-500 transition-colors px-3">
            <LogOut size={15} /> Sign Out
          </button>
        </aside>

        {/* Main */}
        <main className="lg:col-span-3 space-y-8">
          {/* Orders */}
          <section id="orders">
            <h2 className="font-display text-2xl text-fluno-ink mb-5">
              My Orders
            </h2>
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="card p-5">
                  <div className="flex flex-wrap justify-between gap-3">
                    <div>
                      <p className="font-mono text-xs text-fluno-teal">
                        {order.id}
                      </p>
                      <p className="font-body text-sm text-fluno-ink mt-1">
                        {order.items}
                      </p>
                      <p className="font-mono text-xs text-fluno-ink/40 mt-1">
                        {order.date}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-display text-lg text-fluno-teal font-medium">
                        ₹{order.total}
                      </p>
                      <span
                        className={`inline-block mt-1 font-mono text-xs px-2 py-0.5 rounded-sm ${
                          order.status === "Delivered"
                            ? "bg-green-50 text-green-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button className="text-xs font-body text-fluno-teal hover:underline">
                      Track Order
                    </button>
                    <button className="text-xs font-body text-fluno-ink/40 hover:text-fluno-ink">
                      View Details
                    </button>
                    {order.status === "Delivered" && (
                      <button className="text-xs font-body text-fluno-ink/40 hover:text-fluno-ink">
                        Return / Exchange
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Addresses */}
          <section id="addresses">
            <h2 className="font-display text-2xl text-fluno-ink mb-5">
              Saved Addresses
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="card p-5 border-2 border-fluno-teal">
                <p className="font-mono text-xs text-fluno-teal mb-2 uppercase tracking-wider">
                  Default
                </p>
                <p className="font-body text-sm text-fluno-ink/70">
                  Hyderabad, Telangana 500090
                  <br />
                  India
                </p>
                <div className="flex gap-3 mt-3">
                  <button className="text-xs font-body text-fluno-teal hover:underline">Edit</button>
                  <button className="text-xs font-body text-fluno-ink/40 hover:text-red-500">Delete</button>
                </div>
              </div>
              <button className="card p-5 border-dashed border-2 border-fluno-stone text-fluno-ink/40 hover:border-fluno-teal hover:text-fluno-teal transition-colors text-sm font-body flex items-center justify-center gap-2">
                + Add New Address
              </button>
            </div>
          </section>

          {/* Support */}
          <section id="support">
            <h2 className="font-display text-2xl text-fluno-ink mb-5">
              Support
            </h2>
            <div className="card p-6 text-center space-y-3">
              <p className="font-body text-fluno-ink/60">
                Need help? Raise a support ticket or email us directly.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link href="/contact" className="btn-primary">
                  Contact Us
                </Link>
                <a
                  href="mailto:contact@myfluno.com"
                  className="btn-outline"
                >
                  contact@myfluno.com
                </a>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
