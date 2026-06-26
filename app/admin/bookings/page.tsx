"use client";
import React, { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import {
  Search,
  ChevronDown,
  RefreshCw,
  Calendar,
  Users,
  DollarSign,
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3001/api/v1";

interface Booking {
  id: number;
  reference: string;
  checkInDate: string;
  checkOutDate: string;
  totalNights: number;
  guestCount: number;
  totalPrice: number;
  bookingStatus: string;
  createdAt: string;
  guest?: { firstName: string; lastName: string; email: string; phone: string };
}

const STATUS_OPTIONS = [
  "ALL",
  "PENDING",
  "CONFIRMED",
  "CANCELLED",
  "COMPLETED",
  "REJECTED",
  "REFUNDED",
];

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
  CONFIRMED: "bg-green-100 text-green-800 border-green-200",
  CANCELLED: "bg-red-100 text-red-800 border-red-200",
  COMPLETED: "bg-blue-100 text-blue-800 border-blue-200",
  REJECTED: "bg-gray-100 text-gray-700 border-gray-200",
  REFUNDED: "bg-purple-100 text-purple-800 border-purple-200",
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [updating, setUpdating] = useState<number | null>(null);
  const [selected, setSelected] = useState<Booking | null>(null);

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

  useEffect(() => { fetchBookings(); }, []);

  const updateStatus = async (id: number, status: string) => {
    setUpdating(id);
    try {
      await fetch(`${API}/booking/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status }),
      });
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, bookingStatus: status } : b))
      );
      if (selected?.id === id) setSelected((s) => s ? { ...s, bookingStatus: status } : s);
    } finally {
      setUpdating(null);
    }
  };

  const filtered = bookings.filter((b) => {
    const matchStatus = statusFilter === "ALL" || b.bookingStatus === statusFilter;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      b.reference?.toLowerCase().includes(q) ||
      b.guest?.firstName?.toLowerCase().includes(q) ||
      b.guest?.lastName?.toLowerCase().includes(q) ||
      b.guest?.email?.toLowerCase().includes(q);
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
          <button
            onClick={fetchBookings}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, reference..."
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
                <BookingEmpty />
                No bookings found
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    {["Reference", "Guest", "Check-in", "Check-out", "Nights", "Guests", "Amount", "Status", "Actions"].map(
                      (h) => (
                        <th
                          key={h}
                          className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap"
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((b) => (
                    <tr
                      key={b.id}
                      onClick={() => setSelected(b)}
                      className="border-b border-gray-50 hover:bg-green-50/50 cursor-pointer transition-colors"
                    >
                      <td className="px-5 py-4 font-mono text-xs text-gray-500">{b.reference}</td>
                      <td className="px-5 py-4">
                        <div className="font-medium text-gray-900">
                          {b.guest ? `${b.guest.firstName} ${b.guest.lastName}` : "—"}
                        </div>
                        <div className="text-xs text-gray-400">{b.guest?.email}</div>
                      </td>
                      <td className="px-5 py-4 text-gray-600 whitespace-nowrap">{b.checkInDate}</td>
                      <td className="px-5 py-4 text-gray-600 whitespace-nowrap">{b.checkOutDate}</td>
                      <td className="px-5 py-4 text-center text-gray-600">{b.totalNights}</td>
                      <td className="px-5 py-4 text-center text-gray-600">{b.guestCount}</td>
                      <td className="px-5 py-4 font-semibold text-gray-900">${b.totalPrice}</td>
                      <td className="px-5 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                            statusColors[b.bookingStatus] || "bg-gray-100 text-gray-600 border-gray-200"
                          }`}
                        >
                          {b.bookingStatus}
                        </span>
                      </td>
                      <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                        <div className="relative">
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
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Detail modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-green-800 px-6 py-5 flex items-center justify-between">
              <div>
                <p className="font-bold text-white">Booking Detail</p>
                <p className="text-green-200 text-xs font-mono">{selected.reference}</p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="text-white/70 hover:text-white text-xl leading-none"
              >
                ×
              </button>
            </div>
            <div className="p-6 space-y-4">
              {selected.guest && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Guest</p>
                  <p className="font-semibold text-gray-900">
                    {selected.guest.firstName} {selected.guest.lastName}
                  </p>
                  <p className="text-sm text-gray-600">{selected.guest.email}</p>
                  <p className="text-sm text-gray-600">{selected.guest.phone}</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <InfoBox icon={<Calendar className="w-4 h-4" />} label="Check-in" value={selected.checkInDate} />
                <InfoBox icon={<Calendar className="w-4 h-4" />} label="Check-out" value={selected.checkOutDate} />
                <InfoBox icon={<Users className="w-4 h-4" />} label="Guests" value={`${selected.guestCount} guests`} />
                <InfoBox icon={<DollarSign className="w-4 h-4" />} label="Total" value={`$${selected.totalPrice}`} />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Change Status</p>
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

function BookingEmpty() {
  return (
    <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
      <Calendar className="w-8 h-8 text-gray-300" />
    </div>
  );
}
