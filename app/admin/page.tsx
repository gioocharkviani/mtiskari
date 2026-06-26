"use client";
import React, { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import {
  BookOpen,
  CheckCircle,
  Clock,
  DollarSign,
  Users,
  CalendarCheck,
  TrendingUp,
  XCircle,
} from "lucide-react";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3001/api/v1";

interface Stats {
  total: number;
  confirmed: number;
  pending: number;
  cancelled: number;
  totalRevenue: number;
  totalGuests: number;
  upcoming: number;
}

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
  guest?: { firstName: string; lastName: string; email: string };
}

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
  COMPLETED: "bg-blue-100 text-blue-800",
  REJECTED: "bg-gray-100 text-gray-800",
  REFUNDED: "bg-purple-100 text-purple-800",
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, bookingsRes] = await Promise.all([
          fetch(`${API}/booking/stats`, { credentials: "include" }),
          fetch(`${API}/booking/all`, { credentials: "include" }),
        ]);

        if (statsRes.status === 401 || bookingsRes.status === 401) {
          window.location.href = "/admin/login";
          return;
        }

        const statsData = await statsRes.json();
        const bookingsData = await bookingsRes.json();

        if (statsData.success) setStats(statsData.data);
        if (bookingsData.success) {
          setRecentBookings(bookingsData.data.slice(0, 5));
        }
      } catch {
        window.location.href = "/admin/login";
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statCards = stats
    ? [
        {
          label: "Total Bookings",
          value: stats.total,
          icon: BookOpen,
          color: "bg-blue-500",
          bg: "bg-blue-50",
        },
        {
          label: "Confirmed",
          value: stats.confirmed,
          icon: CheckCircle,
          color: "bg-green-500",
          bg: "bg-green-50",
        },
        {
          label: "Pending",
          value: stats.pending,
          icon: Clock,
          color: "bg-yellow-500",
          bg: "bg-yellow-50",
        },
        {
          label: "Cancelled",
          value: stats.cancelled,
          icon: XCircle,
          color: "bg-red-500",
          bg: "bg-red-50",
        },
        {
          label: "Total Revenue",
          value: `$${stats.totalRevenue.toLocaleString()}`,
          icon: DollarSign,
          color: "bg-emerald-500",
          bg: "bg-emerald-50",
        },
        {
          label: "Total Guests",
          value: stats.totalGuests,
          icon: Users,
          color: "bg-purple-500",
          bg: "bg-purple-50",
        },
        {
          label: "Upcoming",
          value: stats.upcoming,
          icon: CalendarCheck,
          color: "bg-indigo-500",
          bg: "bg-indigo-50",
        },
        {
          label: "Occupancy",
          value: stats.total > 0
            ? `${Math.round((stats.confirmed / stats.total) * 100)}%`
            : "0%",
          icon: TrendingUp,
          color: "bg-orange-500",
          bg: "bg-orange-50",
        },
      ]
    : [];

  return (
    <AdminShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">
            Welcome back — here&apos;s an overview
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-5 animate-pulse h-24"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map(({ label, value, icon: Icon, color, bg }) => (
              <div
                key={label}
                className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    {label}
                  </p>
                  <div
                    className={`w-8 h-8 ${bg} rounded-lg flex items-center justify-center`}
                  >
                    <Icon className={`w-4 h-4 ${color.replace("bg-", "text-")}`} />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
              </div>
            ))}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Recent Bookings</h2>
            <Link
              href="/admin/bookings"
              className="text-sm text-green-600 hover:text-green-700 font-medium"
            >
              View all →
            </Link>
          </div>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-6 space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="h-10 bg-gray-100 rounded animate-pulse"
                  />
                ))}
              </div>
            ) : recentBookings.length === 0 ? (
              <div className="p-12 text-center text-gray-400">
                No bookings yet
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                      Reference
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                      Guest
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                      Check-in
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                      Check-out
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                      Amount
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map((b) => (
                    <tr
                      key={b.id}
                      className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 font-mono text-xs text-gray-600">
                        {b.reference}
                      </td>
                      <td className="px-6 py-4 text-gray-900">
                        {b.guest
                          ? `${b.guest.firstName} ${b.guest.lastName}`
                          : "—"}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {b.checkInDate}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {b.checkOutDate}
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-900">
                        ${b.totalPrice}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            statusColors[b.bookingStatus] ||
                            "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {b.bookingStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
