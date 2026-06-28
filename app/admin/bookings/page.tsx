"use client";
import React, { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import {
  Search, ChevronDown, RefreshCw, Calendar, Users,
  Plus, Globe, CreditCard, Banknote,
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3001/api/v1";

interface Channel { id: number; name: string; color: string; }

interface Booking {
  id: number;
  reference: string;
  checkInDate: string;
  checkOutDate: string;
  totalNights: number;
  guestCount: number;
  totalPrice: number;
  bookingStatus: string;
  paymentStatus?: string;
  paymentType?: string;
  channelId?: number;
  channelName?: string;
  createdAt: string;
  guest?: { firstName: string; lastName: string; email: string; phone: string };
}

const STATUS_OPTIONS = ["ALL", "PENDING", "CONFIRMED", "CANCELLED", "COMPLETED", "REJECTED", "REFUNDED"];
const PAYMENT_STATUS_OPTIONS = ["UNPAID", "PAID", "PARTIALLY_PAID"];
const PAYMENT_TYPE_OPTIONS = ["CASH", "CARD", "BANK_TRANSFER"];

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
  CONFIRMED: "bg-green-100 text-green-800 border-green-200",
  CANCELLED: "bg-red-100 text-red-800 border-red-200",
  COMPLETED: "bg-blue-100 text-blue-800 border-blue-200",
  REJECTED: "bg-gray-100 text-gray-700 border-gray-200",
  REFUNDED: "bg-purple-100 text-purple-800 border-purple-200",
};

const paymentStatusColors: Record<string, string> = {
  UNPAID: "bg-red-100 text-red-700",
  PAID: "bg-green-100 text-green-700",
  PARTIALLY_PAID: "bg-yellow-100 text-yellow-700",
};

const paymentTypeIcons: Record<string, React.ReactNode> = {
  CASH: <Banknote className="w-3 h-3" />,
  CARD: <CreditCard className="w-3 h-3" />,
  BANK_TRANSFER: <Globe className="w-3 h-3" />,
};

function ExternalBookingModal({
  channels,
  onClose,
  onSaved,
}: {
  channels: Channel[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({
    checkInDate: "",
    checkOutDate: "",
    channelId: "",
    totalPrice: "",
    guestCount: "1",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleSave = async () => {
    if (!form.checkInDate || !form.checkOutDate) {
      setError("Check-in and check-out dates are required");
      return;
    }
    setSaving(true);
    setError("");
    const selectedChannel = channels.find((c) => c.id === parseInt(form.channelId));
    try {
      const body: Record<string, unknown> = {
        checkInDate: form.checkInDate,
        checkOutDate: form.checkOutDate,
        guestCount: parseInt(form.guestCount) || 1,
        totalPrice: form.totalPrice ? parseFloat(form.totalPrice) : 0,
      };
      if (form.channelId) {
        body.channelId = parseInt(form.channelId);
        body.channelName = selectedChannel?.name;
      }
      if (form.email) { body.email = form.email; body.firstName = form.firstName; body.lastName = form.lastName; body.phone = form.phone; }

      const res = await fetch(`${API}/booking/admin/external`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setError(err.message || "Failed to create booking");
        return;
      }
      onSaved();
      onClose();
    } catch {
      setError("Failed to create booking");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="bg-green-800 px-6 py-5 flex items-center justify-between sticky top-0">
          <div>
            <p className="font-bold text-white">Add External Booking</p>
            <p className="text-green-200 text-xs mt-0.5">Block dates for a channel booking</p>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white text-2xl leading-none">×</button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Booking Channel</label>
            <select
              value={form.channelId}
              onChange={(e) => set("channelId", e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">— Select channel (optional) —</option>
              {channels.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Check-in *</label>
              <input type="date" value={form.checkInDate} onChange={(e) => set("checkInDate", e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Check-out *</label>
              <input type="date" value={form.checkOutDate} onChange={(e) => set("checkOutDate", e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Total Price</label>
              <input type="number" value={form.totalPrice} onChange={(e) => set("totalPrice", e.target.value)}
                placeholder="0"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Guests</label>
              <input type="number" min="1" value={form.guestCount} onChange={(e) => set("guestCount", e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-3">Guest Info (optional)</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">First Name</label>
                <input type="text" value={form.firstName} onChange={(e) => set("firstName", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Last Name</label>
                <input type="text" value={form.lastName} onChange={(e) => set("lastName", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Email</label>
                <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Phone</label>
                <input type="text" value={form.phone} onChange={(e) => set("phone", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
            </div>
          </div>

          {error && <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">{error}</p>}
        </div>

        <div className="px-6 pb-6 flex gap-3">
          <button onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving}
            className="flex-1 px-4 py-2.5 bg-green-700 text-white rounded-xl text-sm font-medium hover:bg-green-800 disabled:opacity-50 transition-colors">
            {saving ? "Creating..." : "Block Dates"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [currency, setCurrency] = useState("GEL");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [updating, setUpdating] = useState<number | null>(null);
  const [selected, setSelected] = useState<Booking | null>(null);
  const [showExternal, setShowExternal] = useState(false);
  const [updatingPayment, setUpdatingPayment] = useState(false);
  const [paymentForm, setPaymentForm] = useState({ paymentStatus: "", paymentType: "" });
  const [toast, setToast] = useState<{ msg: string; type: "success" | "info" } | null>(null);

  const showToast = (msg: string, type: "success" | "info" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/booking/all`, { credentials: "include" });
      if (res.status === 401) { window.location.href = "/admin/login"; return; }
      const data = await res.json();
      if (data.success) setBookings(data.data);
    } finally {
      setLoading(false);
    }
  };

  const fetchChannels = async () => {
    try {
      const res = await fetch(`${API}/channel/all`, { credentials: "include" });
      if (res.ok) setChannels(await res.json());
    } catch { /* ignore */ }
  };

  const fetchCurrency = async () => {
    try {
      const res = await fetch(`${API}/settings`);
      if (res.ok) {
        const data = await res.json();
        if (data?.default_currency) setCurrency(data.default_currency);
      }
    } catch { /* ignore */ }
  };

  useEffect(() => {
    fetchBookings();
    fetchChannels();
    fetchCurrency();
  }, []);

  useEffect(() => {
    if (selected) {
      setPaymentForm({
        paymentStatus: selected.paymentStatus || "UNPAID",
        paymentType: selected.paymentType || "",
      });
    }
  }, [selected]);

  const updateStatus = async (id: number, status: string) => {
    const prev = bookings.find((b) => b.id === id);
    setUpdating(id);
    try {
      const res = await fetch(`${API}/booking/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status }),
      });
      if (!res.ok) { showToast("Failed to update status", "info"); return; }
      setBookings((bList) => bList.map((b) => (b.id === id ? { ...b, bookingStatus: status } : b)));
      if (selected?.id === id) setSelected((s) => s ? { ...s, bookingStatus: status } : s);
      if (status === "CONFIRMED" && prev?.bookingStatus !== "CONFIRMED") {
        showToast("Booking confirmed — confirmation email sent to guest");
      }
    } finally {
      setUpdating(null);
    }
  };

  const updatePayment = async () => {
    if (!selected) return;
    setUpdatingPayment(true);
    try {
      const body: Record<string, string> = {};
      if (paymentForm.paymentStatus) body.paymentStatus = paymentForm.paymentStatus;
      if (paymentForm.paymentType) body.paymentType = paymentForm.paymentType;
      await fetch(`${API}/booking/${selected.id}/payment`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });
      setBookings((prev) =>
        prev.map((b) =>
          b.id === selected.id
            ? { ...b, paymentStatus: paymentForm.paymentStatus, paymentType: paymentForm.paymentType }
            : b
        )
      );
      setSelected((s) =>
        s ? { ...s, paymentStatus: paymentForm.paymentStatus, paymentType: paymentForm.paymentType } : s
      );
    } finally {
      setUpdatingPayment(false);
    }
  };

  const channelMap = Object.fromEntries(channels.map((c) => [c.id, c]));

  const filtered = bookings.filter((b) => {
    const matchStatus = statusFilter === "ALL" || b.bookingStatus === statusFilter;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      b.reference?.toLowerCase().includes(q) ||
      b.guest?.firstName?.toLowerCase().includes(q) ||
      b.guest?.lastName?.toLowerCase().includes(q) ||
      b.guest?.email?.toLowerCase().includes(q) ||
      b.channelName?.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  return (
    <AdminShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
            <p className="text-gray-500 text-sm mt-1">
              {filtered.length} booking{filtered.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowExternal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-700 text-white rounded-xl text-sm font-medium hover:bg-green-800 transition-colors"
            >
              <Plus className="w-4 h-4" /> External Booking
            </button>
            <button
              onClick={fetchBookings}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, reference, channel..."
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-8 space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-16 text-center text-gray-400">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-gray-300" />
                </div>
                No bookings found
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    {["Reference", "Guest / Channel", "Dates", "Guests", "Amount", "Payment", "Status", "Change"].map(
                      (h) => (
                        <th key={h} className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((b) => {
                    const ch = b.channelId ? channelMap[b.channelId] : null;
                    return (
                      <tr
                        key={b.id}
                        onClick={() => setSelected(b)}
                        className="border-b border-gray-50 hover:bg-green-50/50 cursor-pointer transition-colors"
                      >
                        <td className="px-4 py-3.5">
                          <span className="font-mono text-xs text-gray-500">{b.reference}</span>
                        </td>
                        <td className="px-4 py-3.5">
                          {b.guest ? (
                            <div>
                              <div className="font-medium text-gray-900 text-xs">
                                {b.guest.firstName} {b.guest.lastName}
                              </div>
                              <div className="text-xs text-gray-400">{b.guest.email}</div>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">—</span>
                          )}
                          {(b.channelName || ch) && (
                            <div className="flex items-center gap-1 mt-1">
                              <span
                                className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full text-white font-medium"
                                style={{ backgroundColor: ch?.color ?? "#6b7280" }}
                              >
                                <Globe className="w-2.5 h-2.5" />
                                {b.channelName ?? ch?.name}
                              </span>
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3.5 text-xs text-gray-600 whitespace-nowrap">
                          <div>{b.checkInDate}</div>
                          <div className="text-gray-400">→ {b.checkOutDate}</div>
                        </td>
                        <td className="px-4 py-3.5 text-center text-gray-600 text-xs">{b.guestCount}</td>
                        <td className="px-4 py-3.5 font-semibold text-gray-900 text-xs whitespace-nowrap">
                          {b.totalPrice} {currency}
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex flex-col gap-1">
                            {b.paymentStatus && (
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${paymentStatusColors[b.paymentStatus] ?? "bg-gray-100 text-gray-600"}`}>
                                {b.paymentStatus.replace("_", " ")}
                              </span>
                            )}
                            {b.paymentType && (
                              <span className="flex items-center gap-1 text-xs text-gray-500">
                                {paymentTypeIcons[b.paymentType]}
                                {b.paymentType.replace("_", " ")}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[b.bookingStatus] || "bg-gray-100 text-gray-600 border-gray-200"}`}>
                            {b.bookingStatus}
                          </span>
                        </td>
                        <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                          <select
                            value={b.bookingStatus}
                            disabled={updating === b.id}
                            onChange={(e) => updateStatus(b.id, e.target.value)}
                            className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                          >
                            {STATUS_OPTIONS.filter((s) => s !== "ALL").map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="bg-green-800 px-6 py-5 flex items-center justify-between sticky top-0">
              <div>
                <p className="font-bold text-white">Booking Detail</p>
                <p className="text-green-200 text-xs font-mono">{selected.reference}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-white/70 hover:text-white text-xl leading-none">×</button>
            </div>
            <div className="p-6 space-y-5">
              {/* Channel badge */}
              {selected.channelName && (
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-gray-400" />
                  <span
                    className="text-sm px-3 py-1 rounded-full text-white font-medium"
                    style={{ backgroundColor: selected.channelId ? (channelMap[selected.channelId]?.color ?? "#6b7280") : "#6b7280" }}
                  >
                    {selected.channelName}
                  </span>
                </div>
              )}

              {selected.guest && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Guest</p>
                  <p className="font-semibold text-gray-900">{selected.guest.firstName} {selected.guest.lastName}</p>
                  <p className="text-sm text-gray-600">{selected.guest.email}</p>
                  <p className="text-sm text-gray-600">{selected.guest.phone}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <InfoBox icon={<Calendar className="w-4 h-4" />} label="Check-in" value={selected.checkInDate ?? "—"} />
                <InfoBox icon={<Calendar className="w-4 h-4" />} label="Check-out" value={selected.checkOutDate ?? "—"} />
                <InfoBox icon={<Users className="w-4 h-4" />} label="Guests" value={`${selected.guestCount} guests`} />
                <InfoBox icon={<span className="font-bold text-sm">₾</span>} label="Total" value={`${selected.totalPrice} ${currency}`} />
              </div>

              {/* Payment section */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <p className="text-xs font-semibold text-gray-500 uppercase">Payment</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Payment Status</label>
                    <select
                      value={paymentForm.paymentStatus}
                      onChange={(e) => setPaymentForm((p) => ({ ...p, paymentStatus: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      {PAYMENT_STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s.replace("_", " ")}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Payment Type</label>
                    <select
                      value={paymentForm.paymentType}
                      onChange={(e) => setPaymentForm((p) => ({ ...p, paymentType: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">— Not set —</option>
                      {PAYMENT_TYPE_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s.replace("_", " ")}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <button
                  onClick={updatePayment}
                  disabled={updatingPayment}
                  className="w-full px-4 py-2 bg-green-700 text-white rounded-lg text-sm font-medium hover:bg-green-800 disabled:opacity-50 transition-colors"
                >
                  {updatingPayment ? "Saving..." : "Save Payment Info"}
                </button>
              </div>

              {/* Status buttons */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Change Booking Status</p>
                <div className="flex flex-wrap gap-2">
                  {STATUS_OPTIONS.filter((s) => s !== "ALL").map((s) => (
                    <button
                      key={s}
                      onClick={() => updateStatus(selected.id, s)}
                      disabled={updating === selected.id}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                        selected.bookingStatus === s
                          ? "bg-green-600 text-white border-green-600"
                          : "bg-white text-gray-600 border-gray-200 hover:border-green-400 hover:text-green-700"
                      } disabled:opacity-50`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showExternal && (
        <ExternalBookingModal
          channels={channels}
          onClose={() => setShowExternal(false)}
          onSaved={fetchBookings}
        />
      )}

      {toast && (
        <div className={`fixed bottom-6 right-6 z-[9999] px-5 py-3 rounded-xl shadow-lg text-sm font-medium text-white transition-all ${toast.type === "success" ? "bg-green-700" : "bg-gray-700"}`}>
          {toast.msg}
        </div>
      )}
    </AdminShell>
  );
}

function InfoBox({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-gray-50 rounded-xl p-3">
      <div className="flex items-center gap-1.5 text-gray-400 mb-1">
        {icon}
        <p className="text-xs font-medium">{label}</p>
      </div>
      <p className="font-semibold text-gray-900 text-sm">{value}</p>
    </div>
  );
}
