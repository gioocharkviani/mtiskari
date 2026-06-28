"use client";
import React, { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { Save, RefreshCw, Globe } from "lucide-react";

const API = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3001/api/v1";

type LangTab = "en" | "ka";

interface ContentMap {
  [key: string]: { en: string; ka: string };
}

const CONTENT_GROUPS = [
  {
    label: "Hero Section",
    keys: ["hero_title", "hero_subtitle", "hero_btn"],
  },
  {
    label: "Gallery Section (Homepage)",
    keys: ["gallery_title", "gallery_btn"],
  },
  {
    label: "Gallery Page (/gallery)",
    keys: [
      "gallery_page_title",
      "gallery_page_subtitle",
      "gallery_page_empty_title",
      "gallery_page_empty_subtitle",
      "gallery_page_zoom_label",
      "gallery_page_cta_title",
      "gallery_page_cta_desc",
      "gallery_page_cta_btn",
    ],
  },
  {
    label: "Cottage / Features Section",
    keys: ["cottage_title", "cottage_subtitle", "cottage_getaway_title", "cottage_desc"],
  },
  {
    label: "Contact Section",
    keys: ["contact_title", "contact_subtitle", "contact_cta_title", "contact_cta_desc"],
  },
  {
    label: "Booking Widget Labels",
    keys: ["checkin_label", "checkout_label", "guests_label", "total_cost_label", "nights_label", "hero_btn"],
  },
  {
    label: "Navigation",
    keys: ["nav_home", "nav_gallery", "nav_contact"],
  },
  {
    label: "Calendar Page (/calendar)",
    keys: [
      "calendar_page_title",
      "calendar_page_subtitle",
      "select_cottage_label",
      "all_cottages_label",
      "booked_label",
      "selected_label",
      "available_label",
    ],
  },
  {
    label: "Booking Widget — Extra Labels",
    keys: ["price_on_request"],
  },
];

const KEY_LABELS: Record<string, string> = {
  hero_title: "Hero Title",
  hero_subtitle: "Hero Subtitle",
  hero_btn: "Book Button Text",
  gallery_title: "Gallery Section Title",
  gallery_btn: "Gallery Button",
  gallery_page_title: "Gallery Page — Title",
  gallery_page_subtitle: "Gallery Page — Subtitle",
  gallery_page_empty_title: "Gallery Page — Empty State Title",
  gallery_page_empty_subtitle: "Gallery Page — Empty State Subtitle",
  gallery_page_zoom_label: "Gallery Page — Zoom Hint Label",
  gallery_page_cta_title: "Gallery Page — CTA Title",
  gallery_page_cta_desc: "Gallery Page — CTA Description",
  gallery_page_cta_btn: "Gallery Page — CTA Button Text",
  cottage_title: "Cottage Section Title",
  cottage_subtitle: "Cottage Section Subtitle",
  cottage_getaway_title: "Getaway Card Title",
  cottage_desc: "Cottage Description (paragraph)",
  contact_title: "Contact Title",
  contact_subtitle: "Contact Subtitle",
  contact_cta_title: "Contact CTA Title",
  contact_cta_desc: "Contact CTA Description",
  checkin_label: "Check-in Label",
  checkout_label: "Check-out Label",
  guests_label: "Guests Label",
  total_cost_label: "Total Cost Label",
  nights_label: "Nights Label",
  nav_home: "Nav: Home",
  nav_gallery: "Nav: Gallery",
  nav_contact: "Nav: Contact",
  calendar_page_title: "Calendar Page — Title",
  calendar_page_subtitle: "Calendar Page — Subtitle",
  select_cottage_label: "Cottage Selector Label",
  all_cottages_label: "All Cottages Option",
  booked_label: "Legend: Not Available",
  selected_label: "Legend: Selected",
  available_label: "Legend: Available",
  price_on_request: "Price on Request Text",
};

export default function AdminContentPage() {
  const [content, setContent] = useState<ContentMap>({});
  const [edited, setEdited] = useState<ContentMap>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const [activeTab, setActiveTab] = useState<LangTab>("en");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const fetchContent = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/content`, { credentials: "include" });
      if (res.status === 401) { window.location.href = "/admin/login"; return; }
      const data = await res.json();
      if (data && typeof data === "object") {
        // Merge DB data with empty placeholders for any known keys not yet in DB
        const allKeys = CONTENT_GROUPS.flatMap((g) => g.keys);
        const merged: ContentMap = {};
        for (const key of allKeys) {
          merged[key] = data[key] ?? { en: "", ka: "" };
        }
        // Also include any extra keys from DB not in CONTENT_GROUPS
        for (const [k, v] of Object.entries(data)) {
          if (!merged[k]) merged[k] = v as { en: string; ka: string };
        }
        setContent(merged);
        setEdited(JSON.parse(JSON.stringify(merged)));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchContent(); }, []);

  const handleChange = (key: string, lang: LangTab, value: string) => {
    setEdited((prev) => ({
      ...prev,
      [key]: { ...(prev[key] || { en: "", ka: "" }), [lang]: value },
    }));
  };

  const isDirty = JSON.stringify(
    Object.fromEntries(Object.entries(edited).filter(([, v]) => v.en || v.ka))
  ) !== JSON.stringify(
    Object.fromEntries(Object.entries(content).filter(([, v]) => v.en || v.ka))
  );

  const saveAll = async () => {
    setSaving(true);
    try {
      const items = Object.entries(edited)
        .filter(([, val]) => val.en || val.ka)
        .map(([key, val]) => ({ key, en: val.en, ka: val.ka }));
      const res = await fetch(`${API}/content`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ items }),
      });
      const data = await res.json();
      if (data && typeof data === "object") {
        setContent(data);
        setEdited(JSON.parse(JSON.stringify(data)));
      }
      showToast("Content saved!");
    } catch {
      showToast("Save failed");
    } finally {
      setSaving(false);
    }
  };

  const isLong = (key: string) =>
    key.includes("desc") || key.includes("cta_desc") || key.includes("subtitle");

  return (
    <AdminShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Content</h1>
            <p className="text-gray-500 text-sm mt-1">
              Edit homepage texts in English and Georgian
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={fetchContent}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Reload
            </button>
            <button
              onClick={saveAll}
              disabled={saving || !isDirty}
              className="flex items-center gap-2 px-5 py-2 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving..." : "Save All"}
            </button>
          </div>
        </div>

        {/* Language tabs */}
        <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1 w-fit">
          {(["en", "ka"] as LangTab[]).map((l) => (
            <button
              key={l}
              onClick={() => setActiveTab(l)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === l
                  ? "bg-white text-green-700 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              {l === "en" ? "English" : "ქართული"}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {CONTENT_GROUPS.map((group) => (
              <div
                key={group.label}
                className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
              >
                <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
                  <h2 className="font-semibold text-gray-800 text-sm">{group.label}</h2>
                </div>
                <div className="p-5 space-y-4">
                  {group.keys.map((key) => {
                    const val = edited[key]?.[activeTab] ?? "";
                    const label = KEY_LABELS[key] || key;
                    const long = isLong(key);
                    return (
                      <div key={key}>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">
                          {label}
                          {edited[key]?.[activeTab] !== content[key]?.[activeTab] && (
                            <span className="ml-2 text-orange-500 font-normal normal-case">
                              (unsaved)
                            </span>
                          )}
                        </label>
                        {long ? (
                          <textarea
                            value={val}
                            onChange={(e) => handleChange(key, activeTab, e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-y"
                            placeholder={activeTab === "ka" ? "ქართული ტექსტი..." : "English text..."}
                          />
                        ) : (
                          <input
                            type="text"
                            value={val}
                            onChange={(e) => handleChange(key, activeTab, e.target.value)}
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder={activeTab === "ka" ? "ქართული ტექსტი..." : "English text..."}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {isDirty && (
          <div className="sticky bottom-6 flex justify-end">
            <button
              onClick={saveAll}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50 shadow-lg transition-colors"
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving..." : "Save All Changes"}
            </button>
          </div>
        )}
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 bg-green-700 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium z-50">
          {toast}
        </div>
      )}
    </AdminShell>
  );
}
