"use client";
import React, { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { Save, Home, ToggleLeft, ToggleRight, Coins, Layout, Image, Phone, Star } from "lucide-react";

const API = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3001/api/v1";

const CURRENCY_OPTIONS = [
  { code: "GEL", symbol: "₾", label: "Georgian Lari (₾)" },
  { code: "USD", symbol: "$", label: "US Dollar ($)" },
  { code: "EUR", symbol: "€", label: "Euro (€)" },
  { code: "GBP", symbol: "£", label: "British Pound (£)" },
  { code: "TRY", symbol: "₺", label: "Turkish Lira (₺)" },
  { code: "RUB", symbol: "₽", label: "Russian Ruble (₽)" },
];

const SECTIONS = [
  { key: "section_hero", label: "Hero / Booking Widget", description: "The top section with the booking form", icon: Layout },
  { key: "section_rooms", label: "Rooms / Cottages", description: "The cottage details and features section", icon: Home },
  { key: "section_gallery", label: "Gallery", description: "The photo gallery section", icon: Image },
  { key: "section_contact", label: "Contact", description: "The contact form and info section", icon: Phone },
];

export default function AdminSettingsPage() {
  const [multiCottage, setMultiCottage] = useState(false);
  const [currency, setCurrency] = useState("GEL");
  const [sections, setSections] = useState<Record<string, boolean>>({
    section_hero: true,
    section_rooms: true,
    section_gallery: true,
    section_contact: true,
  });
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
          if (data.default_currency) setCurrency(data.default_currency);
          setSections({
            section_hero: data.section_hero !== "false",
            section_rooms: data.section_rooms !== "false",
            section_gallery: data.section_gallery !== "false",
            section_contact: data.section_contact !== "false",
          });
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
          items: [
            { key: "multi_cottage_mode", value: String(multiCottage) },
            { key: "default_currency", value: currency },
            ...SECTIONS.map((s) => ({ key: s.key, value: String(sections[s.key]) })),
          ],
        }),
      });
      if (!res.ok) { showToast("Save failed"); return; }
      showToast("Settings saved!");
    } finally {
      setSaving(false);
    }
  };

  const toggleSection = (key: string) =>
    setSections((prev) => ({ ...prev, [key]: !prev[key] }));

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
          <>
            {/* Cottage mode */}
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
                        </p>
                      </div>
                      <button onClick={() => setMultiCottage((v) => !v)} className="ml-4 shrink-0">
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
                  </div>
                </div>
              </div>
            </div>

            {/* Homepage Sections */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
                <h2 className="font-semibold text-gray-800 text-sm">Homepage Sections</h2>
                <p className="text-xs text-gray-400 mt-0.5">Toggle which sections are visible on the site (EN & KA)</p>
              </div>
              <div className="divide-y divide-gray-50">
                {SECTIONS.map((section) => {
                  const Icon = section.icon;
                  const isOn = sections[section.key];
                  return (
                    <div key={section.key} className="flex items-center gap-4 px-6 py-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isOn ? "bg-green-100" : "bg-gray-100"}`}>
                        <Icon className={`w-5 h-5 ${isOn ? "text-green-700" : "text-gray-400"}`} />
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium ${isOn ? "text-gray-900" : "text-gray-400"}`}>{section.label}</p>
                        <p className="text-xs text-gray-400">{section.description}</p>
                      </div>
                      <button onClick={() => toggleSection(section.key)}>
                        {isOn ? (
                          <ToggleRight className="w-9 h-9 text-green-500" />
                        ) : (
                          <ToggleLeft className="w-9 h-9 text-gray-300" />
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Currency */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
                <h2 className="font-semibold text-gray-800 text-sm">Currency</h2>
              </div>
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                    <Coins className="w-6 h-6 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 mb-1">Default Currency</p>
                    <p className="text-sm text-gray-500 mb-4">
                      Shown in the booking form and admin reports.
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {CURRENCY_OPTIONS.map((opt) => (
                        <button
                          key={opt.code}
                          onClick={() => setCurrency(opt.code)}
                          className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                            currency === opt.code
                              ? "bg-green-600 text-white border-green-600 shadow"
                              : "bg-white text-gray-700 border-gray-200 hover:border-green-400 hover:text-green-700"
                          }`}
                        >
                          <span className="text-lg leading-none">{opt.symbol}</span>
                          <span>{opt.code}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
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
