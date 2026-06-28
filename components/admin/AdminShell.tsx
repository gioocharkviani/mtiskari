"use client";
import React from "react";
import AdminSidebar from "./AdminSidebar";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 lg:ml-64 pt-14 lg:pt-0">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
