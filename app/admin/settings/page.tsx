"use client";
import React, { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { Save, Home, ToggleLeft, ToggleRight } from "lucide-react";

const API = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3001/api/v1";

export default function AdminSettingsPage() {
  const [multiCottage, setMultiCottage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API}/settings`, { credentials: "include" });
        if (res.status === 401) { window.location.href = "/admin/login"; return; }
        const data = await res.json();
        if (data && typeof data === "object") {
          setMultiCottage(data.multi_cottage_mode === "true");
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API}/settings`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          items: [{ key: "multi_cottage_mode", value: String(multiCottage) }],
        }),
      });
      if (!res.ok) { showToast("Save failed"); return; }
      showToast("Settings saved!");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminShell>
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500 text-sm mt-1">Control site-wide features</p>
        </div>

        {loading ? (
          <div className="h-40 bg-gray-100 rounded-xl animate-pulse" />
        ) : (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
              <h2 className="font-semibold text-gray-800 text-sm">Cottage Mode</h2>
            </div>
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center shrink-0">
                  <Home className="w-6 h-6 text-green-700" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">Multi-Cottage Mode</p>
                      <p className="text-sm text-gray-500 mt-0.5">
                        When ON, guests see a cottage selection step before choosing dates.
                        When OFF, the site works as a single-cottage booking site.
                      </p>
                    </div>
                    <button
                      onClick={() => setMultiCottage((v) => !v)}
                      className="ml-4 shrink-0"
                    >
                      {multiCottage ? (
                        <ToggleRight className="w-10 h-10 text-green-500" />
                      ) : (
                        <ToggleLeft className="w-10 h-10 text-gray-400" />
                      )}
                    </button>
                  </div>

                  <div className={`mt-4 rounded-xl px-4 py-3 text-sm font-medium ${multiCottage ? "bg-green-50 text-green-700 border border-green-100" : "bg-gray-50 text-gray-500 border border-gray-100"}`}>
                    {multiCottage
                      ? "✓  Multi-cottage mode is ON — guests will pick a cottage before booking"
                      : "○  Single-cottage mode — guests go directly to date selection"}
                  </div>

                  {multiCottage && (
                    <p className="mt-3 text-xs text-gray-400">
                      Make sure you have at least 2 active cottages configured in{" "}
                      <a href="/admin/cottages" className="text-green-600 underline">
                        Cottages
                      </a>
                      .
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={save}
            disabled={saving || loading}
            className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 bg-green-700 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium z-50">
          {toast}
        </div>
      )}
    </AdminShell>
  );
}
