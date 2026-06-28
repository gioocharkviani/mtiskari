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
  Home,
  Settings,
  Globe,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/bookings", label: "Bookings", icon: BookOpen },
  { href: "/admin/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/admin/gallery", label: "Gallery", icon: Image },
  { href: "/admin/cottages", label: "Cottages", icon: Home },
  { href: "/admin/channels", label: "Channels", icon: Globe },
  { href: "/admin/content", label: "Content / Texts", icon: Languages },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

const API = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3001/api/v1";

// Defined at module level — never re-created, no remounting
interface SidebarNavProps {
  pathname: string;
  onLinkClick: () => void;
  onLogout: () => void;
  loggingOut: boolean;
}

function SidebarNav({ pathname, onLinkClick, onLogout, loggingOut }: SidebarNavProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Logo header */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-green-700 shrink-0">
        <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center">
          <TreePine className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="font-bold text-white text-sm">Mtiskari</p>
          <p className="text-green-200 text-xs">Admin Panel</p>
        </div>
      </div>

      {/* Nav links — scrollable if many items */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={onLinkClick}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? "bg-white text-green-700 shadow-sm"
                  : "text-green-100 hover:bg-green-700 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-green-700 shrink-0">
        <button
          onClick={onLogout}
          disabled={loggingOut}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-green-100 hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {loggingOut ? "Logging out..." : "Logout"}
        </button>
      </div>
    </div>
  );
}

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch(`${API}/auth/admin-signOut`, { method: "POST", credentials: "include" });
    } finally {
      setLoggingOut(false);
      router.push("/admin/login");
    }
  };

  const closeMobile = () => setOpen(false);

  return (
    <>
      {/* Desktop sidebar — fixed left */}
      <aside className="hidden lg:flex flex-col w-64 bg-green-800 min-h-screen fixed left-0 top-0 z-40">
        <SidebarNav
          pathname={pathname}
          onLinkClick={closeMobile}
          onLogout={handleLogout}
          loggingOut={loggingOut}
        />
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-green-800 flex items-center justify-between px-4 py-3 shadow-md">
        <div className="flex items-center gap-2">
          <TreePine className="w-5 h-5 text-white" />
          <span className="font-bold text-white text-sm">Mtiskari Admin</span>
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="text-white p-1.5 rounded-lg hover:bg-green-700 transition-colors"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile drawer overlay */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50"
          onClick={closeMobile}
        />
      )}

      {/* Mobile drawer — always mounted, toggled via translate */}
      <aside
        className={`lg:hidden fixed left-0 top-0 bottom-0 z-50 w-72 bg-green-800 shadow-2xl transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Close button inside drawer */}
        <div className="absolute top-3 right-3 z-10">
          <button
            onClick={closeMobile}
            className="text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-green-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <SidebarNav
          pathname={pathname}
          onLinkClick={closeMobile}
          onLogout={handleLogout}
          loggingOut={loggingOut}
        />
      </aside>
    </>
  );
}
