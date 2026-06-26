"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  Image,
  BookOpen,
  LogOut,
  Menu,
  X,
  TreePine,
  Languages,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/bookings", label: "Bookings", icon: BookOpen },
  { href: "/admin/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/admin/gallery", label: "Gallery", icon: Image },
  { href: "/admin/content", label: "Content / Texts", icon: Languages },
];

const API = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3001/api/v1";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch(`${API}/auth/admin-signOut`, {
        method: "POST",
        credentials: "include",
      });
    } finally {
      setLoggingOut(false);
      router.push("/admin/login");
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 p-6 border-b border-green-700">
        <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center">
          <TreePine className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="font-bold text-white text-sm">Mtiskari</p>
          <p className="text-green-200 text-xs">Admin Panel</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                active
                  ? "bg-white text-green-700 shadow-sm"
                  : "text-green-100 hover:bg-green-700 hover:text-white"
              }`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-green-700">
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-green-100 hover:bg-red-500 hover:text-white transition-all"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {loggingOut ? "Logging out..." : "Logout"}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-green-800 min-h-screen fixed left-0 top-0 z-40">
        <SidebarContent />
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-green-800 flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <TreePine className="w-5 h-5 text-white" />
          <span className="font-bold text-white text-sm">Mtiskari Admin</span>
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="text-white p-1 rounded-lg hover:bg-green-700"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <>
          <div
            className="lg:hidden fixed inset-0 z-40 bg-black/50"
            onClick={() => setOpen(false)}
          />
          <aside className="lg:hidden fixed left-0 top-0 bottom-0 z-50 w-64 bg-green-800">
            <SidebarContent />
          </aside>
        </>
      )}
    </>
  );
}
