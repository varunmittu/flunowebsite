"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Package, MapPin, Ticket, LogOut, User, Loader2,
  Plus, Pencil, Trash2, Star, Check, X, KeyRound,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface Order {
  _id: string;
  orderId: string;
  createdAt: string;
  items: { name: string; qty: number }[];
  total: number;
  status: string;
}

interface Address {
  _id: string;
  label?: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone?: string;
  isDefault?: boolean;
}

const EMPTY_FORM = { label: "Home", name: "", phone: "", address: "", city: "", state: "", pincode: "" };
const LABELS     = ["Home", "Work", "Other"];

const STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat",
  "Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh",
  "Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab",
  "Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh",
  "Uttarakhand","West Bengal","Delhi","Jammu & Kashmir","Ladakh","Puducherry",
];

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [orders, setOrders]         = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  const [addresses, setAddresses]       = useState<Address[]>([]);
  const [addrLoading, setAddrLoading]   = useState(true);
  const [showForm, setShowForm]         = useState(false);
  const [editId, setEditId]             = useState<string | null>(null);
  const [addrForm, setAddrForm]         = useState(EMPTY_FORM);
  const [addrSaving, setAddrSaving]     = useState(false);
  const [deletingId, setDeletingId]     = useState<string | null>(null);

  const [pwForm, setPwForm]       = useState({ current: "", next: "", confirm: "" });
  const [pwSaving, setPwSaving]   = useState(false);

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    if (pwForm.next !== pwForm.confirm) {
      toast.error("New passwords do not match");
      return;
    }
    setPwSaving(true);
    try {
      const res  = await fetch("/api/auth/change-password", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ currentPassword: pwForm.current, newPassword: pwForm.next }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Failed to change password");
        return;
      }
      toast.success("Password updated");
      setPwForm({ current: "", next: "", confirm: "" });
    } catch {
      toast.error("Network error — please try again");
    } finally {
      setPwSaving(false);
    }
  }

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/login");
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/orders/mine")
      .then((r) => r.json())
      .then((d) => setOrders(d.orders ?? []))
      .catch(() => {})
      .finally(() => setOrdersLoading(false));

    fetch("/api/addresses")
      .then((r) => r.json())
      .then((d) => setAddresses(d.addresses ?? []))
      .catch(() => {})
      .finally(() => setAddrLoading(false));
  }, [status]);

  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-fig-terracotta" />
      </div>
    );
  }

  const user = session!.user as { name?: string; email?: string; image?: string };

  function setF(k: keyof typeof EMPTY_FORM, v: string) {
    setAddrForm((f) => ({ ...f, [k]: v }));
  }

  function openAdd() {
    setEditId(null);
    setAddrForm(EMPTY_FORM);
    setShowForm(true);
  }

  function openEdit(addr: Address) {
    setEditId(addr._id);
    setAddrForm({
      label:   addr.label   ?? "Home",
      name:    addr.name,
      phone:   addr.phone   ?? "",
      address: addr.address,
      city:    addr.city,
      state:   addr.state,
      pincode: addr.pincode,
    });
    setShowForm(true);
  }

  function cancelForm() {
    setShowForm(false);
    setEditId(null);
    setAddrForm(EMPTY_FORM);
  }

  async function saveAddress(e: React.FormEvent) {
    e.preventDefault();
    const { name, address, city, state, pincode } = addrForm;
    if (!name || !address || !city || !state || !pincode) {
      toast.error("Please fill all required fields");
      return;
    }
    setAddrSaving(true);
    try {
      let res, data;
      if (editId) {
        res  = await fetch("/api/addresses", {
          method:  "PATCH",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify({ id: editId, ...addrForm }),
        });
        data = await res.json();
        toast.success("Address updated");
      } else {
        res  = await fetch("/api/addresses", {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify(addrForm),
        });
        data = await res.json();
        toast.success("Address saved", { icon: "📍" });
      }
      if (!res.ok) throw new Error(data.error ?? "Failed");
      setAddresses(data.addresses);
      cancelForm();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to save address");
    } finally {
      setAddrSaving(false);
    }
  }

  async function setDefault(id: string) {
    try {
      const res  = await fetch("/api/addresses", {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ id, setDefault: true }),
      });
      const data = await res.json();
      setAddresses(data.addresses);
      toast.success("Default address updated");
    } catch {
      toast.error("Failed to update");
    }
  }

  async function deleteAddress(id: string) {
    setDeletingId(id);
    try {
      const res  = await fetch("/api/addresses", {
        method:  "DELETE",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ id }),
      });
      const data = await res.json();
      setAddresses(data.addresses);
      toast.success("Address removed");
    } catch {
      toast.error("Failed to delete");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="bg-fig-paper border border-fig-navy/10 rounded-2xl p-6 mb-4">
            <div className="flex items-center gap-3 mb-5">
              {user.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.image} alt="" className="w-12 h-12 rounded-full object-cover" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-fig-terracotta/10 flex items-center justify-center">
                  <User size={22} className="text-fig-terracotta" />
                </div>
              )}
              <div>
                <p className="font-fig font-bold text-base text-fig-navy">{user.name ?? "My Account"}</p>
                <p className="font-fig-body text-xs text-fig-navy/40">{user.email}</p>
              </div>
            </div>
            <nav className="space-y-1">
              {[
                { icon: Package,  label: "Orders",    href: "#orders"    },
                { icon: MapPin,   label: "Addresses", href: "#addresses" },
                { icon: KeyRound, label: "Security",  href: "#security"  },
                { icon: Ticket,   label: "Support",   href: "#support"   },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-fig-body text-fig-navy/70 hover:bg-fig-sage/40 hover:text-fig-terracotta transition-colors"
                >
                  <item.icon size={16} />
                  {item.label}
                  {item.label === "Addresses" && addresses.length > 0 && (
                    <span className="ml-auto font-fig-body text-[10px] bg-fig-terracotta/10 text-fig-terracotta px-1.5 py-0.5 rounded-full">
                      {addresses.length}
                    </span>
                  )}
                </a>
              ))}
            </nav>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-2 text-sm font-fig-body text-fig-navy/40 hover:text-red-500 transition-colors px-3"
          >
            <LogOut size={15} /> Sign Out
          </button>
        </aside>

        {/* Main */}
        <main className="lg:col-span-3 space-y-10">

          {/* ── Orders ── */}
          <section id="orders">
            <h2 className="font-fig font-bold text-2xl text-fig-navy mb-5">My Orders</h2>
            {ordersLoading ? (
              <div className="bg-fig-paper border border-fig-navy/10 rounded-2xl p-8 flex justify-center">
                <Loader2 size={24} className="animate-spin text-fig-terracotta" />
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-fig-paper border border-fig-navy/10 rounded-2xl p-8 text-center">
                <p className="font-fig-body text-fig-navy/50 mb-4">No orders yet.</p>
                <Link href="/shop" className="fig-btn">Start Shopping</Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order._id} className="bg-fig-paper border border-fig-navy/10 rounded-2xl p-5">
                    <div className="flex flex-wrap justify-between gap-3">
                      <div>
                        <p className="font-fig-body text-xs text-fig-terracotta">{order.orderId}</p>
                        <p className="font-fig-body text-sm text-fig-navy mt-1">
                          {order.items.map((i) => `${i.name} × ${i.qty}`).join(", ")}
                        </p>
                        <p className="font-fig-body text-xs text-fig-navy/40 mt-1">
                          {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-fig font-bold text-lg text-fig-terracotta font-medium">₹{order.total}</p>
                        <span className={`inline-block mt-1 font-fig-body text-xs px-2 py-0.5 rounded-full ${
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

          {/* ── Addresses ── */}
          <section id="addresses">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-fig font-bold text-2xl text-fig-navy">Saved Addresses</h2>
              {!showForm && (
                <button onClick={openAdd} className="fig-btn-outline text-sm gap-1.5">
                  <Plus size={14} /> Add Address
                </button>
              )}
            </div>

            {/* Add / Edit form */}
            <AnimatePresence>
              {showForm && (
                <motion.form
                  onSubmit={saveAddress}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden mb-5"
                >
                  <div className="bg-fig-paper border border-fig-navy/10 rounded-2xl p-6 border-2 border-fig-terracotta/25">
                    <div className="flex items-center justify-between mb-5">
                      <h3 className="font-fig font-bold font-semibold text-fig-navy text-base">
                        {editId ? "Edit Address" : "Add New Address"}
                      </h3>
                      <button type="button" onClick={cancelForm} className="text-fig-ink-soft/50 hover:text-fig-navy transition-colors">
                        <X size={18} />
                      </button>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4 mb-4">
                      {LABELS.map((l) => (
                        <button
                          key={l}
                          type="button"
                          onClick={() => setF("label", l)}
                          className={`py-2 rounded-xl font-fig-body text-sm border-2 transition-all ${
                            addrForm.label === l
                              ? "border-fig-terracotta bg-fig-terracotta/8 text-fig-terracotta font-semibold"
                              : "border-fig-sage text-fig-ink-soft hover:border-fig-terracotta/40"
                          }`}
                        >
                          {l === "Home" ? "🏠" : l === "Work" ? "💼" : "📍"} {l}
                        </button>
                      ))}
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-fig-body text-xs text-fig-ink-soft/60 mb-1 uppercase tracking-wide">Full Name *</label>
                        <input value={addrForm.name} onChange={(e) => setF("name", e.target.value)} required placeholder="Recipient name" className="fig-input w-full" />
                      </div>
                      <div>
                        <label className="block font-fig-body text-xs text-fig-ink-soft/60 mb-1 uppercase tracking-wide">Phone</label>
                        <input value={addrForm.phone} onChange={(e) => setF("phone", e.target.value)} placeholder="+91 98765 43210" className="fig-input w-full" />
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="block font-fig-body text-xs text-fig-ink-soft/60 mb-1 uppercase tracking-wide">Address *</label>
                      <input value={addrForm.address} onChange={(e) => setF("address", e.target.value)} required placeholder="Flat / Street / Locality" className="fig-input w-full" />
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4 mt-4">
                      <div>
                        <label className="block font-fig-body text-xs text-fig-ink-soft/60 mb-1 uppercase tracking-wide">City *</label>
                        <input value={addrForm.city} onChange={(e) => setF("city", e.target.value)} required placeholder="City" className="fig-input w-full" />
                      </div>
                      <div>
                        <label className="block font-fig-body text-xs text-fig-ink-soft/60 mb-1 uppercase tracking-wide">State *</label>
                        <select value={addrForm.state} onChange={(e) => setF("state", e.target.value)} required className="fig-input w-full">
                          <option value="">Select state</option>
                          {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block font-fig-body text-xs text-fig-ink-soft/60 mb-1 uppercase tracking-wide">Pincode *</label>
                        <input
                          value={addrForm.pincode}
                          onChange={(e) => setF("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))}
                          required
                          placeholder="500034"
                          maxLength={6}
                          className="fig-input w-full font-fig-body"
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 mt-5 justify-end">
                      <button type="button" onClick={cancelForm} className="fig-btn-outline text-sm">Cancel</button>
                      <button type="submit" disabled={addrSaving} className="fig-btn text-sm">
                        {addrSaving
                          ? <><Loader2 size={14} className="animate-spin" /> Saving…</>
                          : <><Check size={14} /> {editId ? "Update" : "Save Address"}</>
                        }
                      </button>
                    </div>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Address cards */}
            {addrLoading ? (
              <div className="bg-fig-paper border border-fig-navy/10 rounded-2xl p-8 flex justify-center">
                <Loader2 size={22} className="animate-spin text-fig-terracotta" />
              </div>
            ) : addresses.length === 0 ? (
              <div className="bg-fig-paper border border-fig-navy/10 rounded-2xl p-10 text-center">
                <div className="w-14 h-14 rounded-2xl bg-fig-terracotta/8 flex items-center justify-center mx-auto mb-3">
                  <MapPin size={24} className="text-fig-terracotta/50" />
                </div>
                <p className="font-fig-body text-fig-navy/50 mb-1">No saved addresses yet.</p>
                <p className="font-fig-body text-xs text-fig-ink-soft/40">Add an address for faster checkout.</p>
                {!showForm && (
                  <button onClick={openAdd} className="fig-btn mt-4 text-sm gap-1.5">
                    <Plus size={14} /> Add Your First Address
                  </button>
                )}
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                <AnimatePresence>
                  {addresses.map((addr) => (
                    <motion.div
                      key={addr._id}
                      layout
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.2 }}
                      className={`bg-fig-paper border border-fig-navy/10 rounded-2xl p-5 relative flex flex-col gap-3 ${
                        addr.isDefault ? "border-2 border-fig-terracotta/30" : ""
                      }`}
                    >
                      {/* Label + default badge */}
                      <div className="flex items-center justify-between">
                        <span className="font-fig-body text-xs font-semibold text-fig-terracotta/80 bg-fig-terracotta/8 px-2.5 py-0.5 rounded-full">
                          {addr.label === "Home" ? "🏠" : addr.label === "Work" ? "💼" : "📍"} {addr.label ?? "Address"}
                        </span>
                        {addr.isDefault && (
                          <span className="flex items-center gap-1 font-fig-body text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                            <Star size={9} className="fill-amber-500 text-amber-500" /> Default
                          </span>
                        )}
                      </div>

                      {/* Address detail */}
                      <div className="font-fig-body text-sm text-fig-navy/80 leading-relaxed">
                        <p className="font-semibold text-fig-navy">{addr.name}</p>
                        <p>{addr.address}</p>
                        <p>{addr.city}, {addr.state} — {addr.pincode}</p>
                        {addr.phone && <p className="text-fig-ink-soft/70 text-xs mt-1 font-fig-body">{addr.phone}</p>}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 pt-1 border-t border-fig-sage/40">
                        {!addr.isDefault && (
                          <button
                            onClick={() => setDefault(addr._id)}
                            className="font-fig-body text-[11px] text-fig-terracotta hover:underline flex items-center gap-1"
                          >
                            <Star size={10} /> Set default
                          </button>
                        )}
                        <div className="ml-auto flex gap-1">
                          <button
                            onClick={() => openEdit(addr)}
                            className="p-1.5 rounded-lg text-fig-ink-soft/60 hover:text-fig-terracotta hover:bg-fig-terracotta/8 transition-colors"
                            title="Edit"
                          >
                            <Pencil size={13} />
                          </button>
                          <button
                            onClick={() => deleteAddress(addr._id)}
                            disabled={deletingId === addr._id}
                            className="p-1.5 rounded-lg text-fig-ink-soft/60 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-40"
                            title="Delete"
                          >
                            {deletingId === addr._id
                              ? <Loader2 size={13} className="animate-spin" />
                              : <Trash2 size={13} />
                            }
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Add more bg-fig-paper border border-fig-navy/10 rounded-2xl */}
                {!showForm && (
                  <motion.button
                    layout
                    onClick={openAdd}
                    className="bg-fig-paper border border-fig-navy/10 rounded-2xl p-5 flex flex-col items-center justify-center gap-2 border-dashed border-2 border-fig-sage hover:border-fig-terracotta/40 hover:bg-fig-terracotta/3 transition-all text-fig-ink-soft/50 hover:text-fig-terracotta min-h-[160px]"
                  >
                    <Plus size={22} />
                    <span className="font-fig-body text-sm">Add new address</span>
                  </motion.button>
                )}
              </div>
            )}
          </section>

          {/* ── Support ── */}
          {/* ── Security ── */}
          <section id="security">
            <h2 className="font-fig font-bold text-2xl text-fig-navy mb-5">Security</h2>
            <div className="bg-fig-paper border border-fig-navy/10 rounded-2xl p-6">
              <p className="font-fig-body text-sm text-fig-navy/60 mb-5">
                Change your account password. If you signed up with Google, your password is managed by Google.
              </p>
              <form onSubmit={changePassword} className="space-y-4 max-w-md">
                <div>
                  <label className="block font-fig-body text-sm text-fig-navy/70 mb-1">Current password</label>
                  <input
                    type="password"
                    value={pwForm.current}
                    onChange={(e) => setPwForm((f) => ({ ...f, current: e.target.value }))}
                    required
                    className="fig-input w-full"
                    placeholder="••••••••"
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-fig-body text-sm text-fig-navy/70 mb-1">New password</label>
                    <input
                      type="password"
                      value={pwForm.next}
                      onChange={(e) => setPwForm((f) => ({ ...f, next: e.target.value }))}
                      required
                      minLength={6}
                      className="fig-input w-full"
                      placeholder="Min 6 characters"
                    />
                  </div>
                  <div>
                    <label className="block font-fig-body text-sm text-fig-navy/70 mb-1">Confirm new password</label>
                    <input
                      type="password"
                      value={pwForm.confirm}
                      onChange={(e) => setPwForm((f) => ({ ...f, confirm: e.target.value }))}
                      required
                      minLength={6}
                      className="fig-input w-full"
                      placeholder="Repeat new password"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={pwSaving || !pwForm.current || !pwForm.next || !pwForm.confirm}
                  className="fig-btn disabled:opacity-50"
                >
                  {pwSaving ? <><Loader2 size={14} className="animate-spin" /> Updating…</> : <><KeyRound size={14} /> Update Password</>}
                </button>
              </form>
            </div>
          </section>

          <section id="support">
            <h2 className="font-fig font-bold text-2xl text-fig-navy mb-5">Support</h2>
            <div className="bg-fig-paper border border-fig-navy/10 rounded-2xl p-6 text-center space-y-3">
              <p className="font-fig-body text-fig-navy/60">Need help? Raise a support ticket or email us directly.</p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link href="/support" className="fig-btn">Raise a Ticket</Link>
                <a href="mailto:contact@myfluno.com" className="fig-btn-outline">contact@myfluno.com</a>
              </div>
            </div>
          </section>

        </main>
      </div>
    </div>
  );
}
