"use client";
import React, { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { Save, RefreshCw, Globe, AlertCircle, CheckCircle } from "lucide-react";

const API = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3001/api/v1";

type LangTab = "en" | "ka";

interface ContentMap {
  [key: string]: { en: string; ka: string };
}

const FEATURE_CARDS_EXAMPLE = `[
  {
    "title": "Rooms",
    "icon": "bed",
    "items": ["2 Bedrooms", "Kitchen", "Bathroom", "Balcony"]
  },
  {
    "title": "Amenities",
    "icon": "snowflake",
    "items": ["Air Conditioning", "Heating", "Mountain View"]
  }
]`;

const CONTENT_GROUPS = [
  { label: "Hero Section", keys: ["hero_title", "hero_subtitle", "hero_btn"] },
  { label: "Gallery Section (Homepage)", keys: ["gallery_title", "gallery_btn"] },
  {
    label: "Gallery Page (/gallery)",
    keys: [
      "gallery_page_title", "gallery_page_subtitle", "gallery_page_empty_title",
      "gallery_page_empty_subtitle", "gallery_page_zoom_label",
      "gallery_page_cta_title", "gallery_page_cta_desc", "gallery_page_cta_btn",
    ],
  },
  {
    label: "Cottage Section",
    keys: ["cottage_title", "cottage_subtitle", "cottage_getaway_title", "cottage_desc"],
  },
  {
    label: "Contact Section",
    keys: ["contact_title", "contact_subtitle", "contact_cta_title", "contact_cta_desc"],
  },
  {
    label: "Booking Widget",
    keys: ["checkin_label", "checkout_label", "guests_label", "total_cost_label", "nights_label", "price_on_request"],
  },
  { label: "Navigation", keys: ["nav_home", "nav_gallery", "nav_contact"] },
  {
    label: "Calendar Page (/calendar)",
    keys: ["calendar_page_title", "calendar_page_subtitle", "select_cottage_label", "all_cottages_label", "booked_label", "selected_label", "available_label"],
  },
];

const KEY_LABELS: Record<string, string> = {
  hero_title: "Title",
  hero_subtitle: "Subtitle",
  hero_btn: "Book Button",
  gallery_title: "Gallery Title",
  gallery_btn: "Gallery Button",
  gallery_page_title: "Page Title",
  gallery_page_subtitle: "Page Subtitle",
  gallery_page_empty_title: "Empty State Title",
  gallery_page_empty_subtitle: "Empty State Subtitle",
  gallery_page_zoom_label: "Zoom Hint",
  gallery_page_cta_title: "CTA Title",
  gallery_page_cta_desc: "CTA Description",
  gallery_page_cta_btn: "CTA Button",
  cottage_title: "Section Title",
  cottage_subtitle: "Section Subtitle",
  cottage_getaway_title: "Getaway Title",
  cottage_desc: "Description Paragraph",
  contact_title: "Title",
  contact_subtitle: "Subtitle",
  contact_cta_title: "CTA Title",
  contact_cta_desc: "CTA Description",
  checkin_label: "Check-in Label",
  checkout_label: "Check-out Label",
  guests_label: "Guests Label",
  total_cost_label: "Total Cost Label",
  nights_label: "Nights Label",
  price_on_request: "Price on Request",
  nav_home: "Home",
  nav_gallery: "Gallery",
  nav_contact: "Contact",
  calendar_page_title: "Page Title",
  calendar_page_subtitle: "Page Subtitle",
  select_cottage_label: "Cottage Selector Label",
  all_cottages_label: "All Cottages Option",
  booked_label: "Unavailable Legend",
  selected_label: "Selected Legend",
  available_label: "Available Legend",
};

const isLongText = (key: string) =>
  key.includes("desc") || key.includes("subtitle") || key.includes("cta_desc");

function validateFeatureJson(str: string): string | null {
  try {
    const parsed = JSON.parse(str);
    if (!Array.isArray(parsed)) return "Must be a JSON array [ ... ]";
    for (const item of parsed) {
      if (typeof item.title !== "string") return "Each item must have a \"title\" string";
      if (!Array.isArray(item.items)) return "Each item must have an \"items\" array";
    }
    return null;
  } catch {
    return "Invalid JSON — check syntax";
  }
}

export default function AdminContentPage() {
  const [content, setContent] = useState<ContentMap>({});
  const [edited, setEdited] = useState<ContentMap>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const [activeTab, setActiveTab] = useState<LangTab>("en");
  const [jsonErrors, setJsonErrors] = useState<Record<string, string>>({});

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
        setContent(data);
        setEdited(JSON.parse(JSON.stringify(data)));
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
    if (key === "feature_cards") {
      const err = validateFeatureJson(value);
      setJsonErrors((prev) => ({ ...prev, [`${key}_${lang}`]: err || "" }));
    }
  };

  const isDirty = JSON.stringify(edited) !== JSON.stringify(content);

  const saveAll = async () => {
    // Block save if any JSON field has errors
    const hasErrors = Object.values(jsonErrors).some(Boolean);
    if (hasErrors) { showToast("Fix JSON errors before saving"); return; }

    setSaving(true);
    try {
      const items = Object.entries(edited)
        .filter(([, val]) => val.en !== undefined || val.ka !== undefined)
        .map(([key, val]) => ({ key, en: val.en ?? "", ka: val.ka ?? "" }));
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

  const featureCardsValue = edited["feature_cards"]?.[activeTab] ?? "";
  const featureCardsError = jsonErrors[`feature_cards_${activeTab}`];

  return (
    <AdminShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Content & Texts</h1>
            <p className="text-gray-500 text-sm mt-1">Edit all site texts in English and Georgian</p>
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
                activeTab === l ? "bg-white text-green-700 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              {l === "en" ? "English" : "ქართული"}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => <div key={i} className="h-32 bg-gray-100 rounded-xl animate-pulse" />)}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Feature Cards JSON editor */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
                <h2 className="font-semibold text-gray-800 text-sm">Feature Cards (Rooms / Amenities / Nature)</h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  JSON array — each card has <code className="bg-gray-200 px-1 rounded">title</code>,{" "}
                  <code className="bg-gray-200 px-1 rounded">icon</code> (bed / snowflake / mountain / wifi / car / flame / utensils / star / shield / sun / bath),{" "}
                  <code className="bg-gray-200 px-1 rounded">items</code> (string array)
                </p>
              </div>
              <div className="p-5">
                <div className="relative">
                  <textarea
                    value={featureCardsValue}
                    onChange={(e) => handleChange("feature_cards", activeTab, e.target.value)}
                    rows={12}
                    spellCheck={false}
                    className={`w-full px-3 py-3 border rounded-xl text-sm font-mono focus:outline-none focus:ring-2 resize-y ${
                      featureCardsError
                        ? "border-red-300 focus:ring-red-400 bg-red-50"
                        : "border-gray-200 focus:ring-green-500 bg-white"
                    }`}
                    placeholder={FEATURE_CARDS_EXAMPLE}
                  />
                  {featureCardsError && (
                    <div className="mt-1.5 flex items-center gap-1.5 text-red-600 text-xs">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      {featureCardsError}
                    </div>
                  )}
                  {!featureCardsError && featureCardsValue && (
                    <div className="mt-1.5 flex items-center gap-1.5 text-green-600 text-xs">
                      <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                      Valid JSON
                    </div>
                  )}
                </div>
                <details className="mt-3">
                  <summary className="text-xs text-gray-400 cursor-pointer select-none hover:text-gray-600">
                    Show format example
                  </summary>
                  <pre className="mt-2 bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-600 overflow-x-auto">
{FEATURE_CARDS_EXAMPLE}
                  </pre>
                </details>
              </div>
            </div>

            {/* Regular text groups */}
            {CONTENT_GROUPS.map((group) => (
              <div key={group.label} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
                  <h2 className="font-semibold text-gray-800 text-sm">{group.label}</h2>
                </div>
                <div className="p-5 space-y-4">
                  {group.keys.map((key) => {
                    const val = edited[key]?.[activeTab] ?? "";
                    const label = KEY_LABELS[key] || key;
                    const long = isLongText(key);
                    const changed = (edited[key]?.[activeTab] ?? "") !== (content[key]?.[activeTab] ?? "");
                    return (
                      <div key={key}>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">
                          {label}
                          {changed && (
                            <span className="ml-2 text-orange-500 font-normal normal-case">(unsaved)</span>
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
