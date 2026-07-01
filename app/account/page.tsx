"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, MapPin, Ticket, LogOut, User, Loader2 } from "lucide-react";

interface Order {
  _id: string;
  orderId: string;
  createdAt: string;
  items: { name: string; qty: number }[];
  total: number;
  status: string;
}

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders]   = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/login");
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/orders/mine")
      .then((r) => r.json())
      .then((d) => setOrders(d.orders ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [status]);

  if (status === "loading" || (status === "unauthenticated")) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-fluno-purple" />
      </div>
    );
  }

  const user = session!.user as { name?: string; email?: string; image?: string; phone?: string };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="card p-6 mb-4">
            <div className="flex items-center gap-3 mb-5">
              {user.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.image} alt="" className="w-12 h-12 rounded-full object-cover" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-fluno-purple/10 flex items-center justify-center">
                  <User size={22} className="text-fluno-purple" />
                </div>
              )}
              <div>
                <p className="font-display text-base text-fluno-ink">{user.name ?? "My Account"}</p>
                <p className="font-mono text-xs text-fluno-ink/40">{user.email}</p>
              </div>
            </div>
            <nav className="space-y-1">
              {[
                { icon: Package, label: "Orders",    href: "#orders"    },
                { icon: MapPin,  label: "Addresses", href: "#addresses" },
                { icon: Ticket,  label: "Support",   href: "#support"   },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-body text-fluno-ink/70 hover:bg-fluno-stone/30 hover:text-fluno-purple transition-colors"
                >
                  <item.icon size={16} />
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-2 text-sm font-body text-fluno-ink/40 hover:text-red-500 transition-colors px-3"
          >
            <LogOut size={15} /> Sign Out
          </button>
        </aside>

        {/* Main */}
        <main className="lg:col-span-3 space-y-8">
          {/* Orders */}
          <section id="orders">
            <h2 className="font-display text-2xl text-fluno-ink mb-5">My Orders</h2>
            {loading ? (
              <div className="card p-8 flex justify-center">
                <Loader2 size={24} className="animate-spin text-fluno-purple" />
              </div>
            ) : orders.length === 0 ? (
              <div className="card p-8 text-center">
                <p className="font-body text-fluno-ink/50 mb-4">No orders yet.</p>
                <Link href="/shop" className="btn-primary">Start Shopping</Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order._id} className="card p-5">
                    <div className="flex flex-wrap justify-between gap-3">
                      <div>
                        <p className="font-mono text-xs text-fluno-purple">{order.orderId}</p>
                        <p className="font-body text-sm text-fluno-ink mt-1">
                          {order.items.map((i) => `${i.name} × ${i.qty}`).join(", ")}
                        </p>
                        <p className="font-mono text-xs text-fluno-ink/40 mt-1">
                          {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-display text-lg text-fluno-purple font-medium">₹{order.total}</p>
                        <span className={`inline-block mt-1 font-mono text-xs px-2 py-0.5 rounded-sm ${
                          order.status === "delivered" ? "bg-green-50 text-green-700" :
                          order.status === "cancelled" ? "bg-red-50 text-red-600"    :
                          "bg-amber-50 text-amber-700"
                        }`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Addresses */}
          <section id="addresses">
            <h2 className="font-display text-2xl text-fluno-ink mb-5">Saved Addresses</h2>
            <div className="card p-8 text-center">
              <p className="font-body text-fluno-ink/50 mb-4">Address management coming soon.</p>
            </div>
          </section>

          {/* Support */}
          <section id="support">
            <h2 className="font-display text-2xl text-fluno-ink mb-5">Support</h2>
            <div className="card p-6 text-center space-y-3">
              <p className="font-body text-fluno-ink/60">Need help? Raise a support ticket or email us directly.</p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link href="/contact"                   className="btn-primary">Contact Us</Link>
                <a href="mailto:contact@myfluno.com"    className="btn-outline">contact@myfluno.com</a>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
