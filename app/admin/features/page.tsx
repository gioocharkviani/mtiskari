"use client";
import React, { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import {
  Plus, Trash2, Save, GripVertical, Eye, EyeOff, Globe,
  Bed, Snowflake, Mountain, Wifi, Car, Flame, Utensils, Star, Shield,
  Trees, Sun, Bath, ChevronDown, ChevronUp, X,
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3001/api/v1";

type LangTab = "en" | "ka";

interface FeatureCard {
  id: number;
  titleEn: string;
  titleKa: string;
  icon: string;
  itemsEn: string[];
  itemsKa: string[];
  isVisible: boolean;
  order: number;
}

const ICONS: { key: string; label: string; component: React.ReactNode }[] = [
  { key: "bed", label: "Bed / Rooms", component: <Bed className="w-5 h-5" /> },
  { key: "snowflake", label: "Snowflake / AC", component: <Snowflake className="w-5 h-5" /> },
  { key: "mountain", label: "Mountain / Nature", component: <Mountain className="w-5 h-5" /> },
  { key: "wifi", label: "WiFi", component: <Wifi className="w-5 h-5" /> },
  { key: "car", label: "Car / Parking", component: <Car className="w-5 h-5" /> },
  { key: "flame", label: "Fireplace", component: <Flame className="w-5 h-5" /> },
  { key: "utensils", label: "Kitchen", component: <Utensils className="w-5 h-5" /> },
  { key: "star", label: "Star", component: <Star className="w-5 h-5" /> },
  { key: "shield", label: "Security", component: <Shield className="w-5 h-5" /> },
  { key: "trees", label: "Trees / Forest", component: <Trees className="w-5 h-5" /> },
  { key: "sun", label: "Outdoor / Sun", component: <Sun className="w-5 h-5" /> },
  { key: "bath", label: "Bath", component: <Bath className="w-5 h-5" /> },
];

export function IconDisplay({ icon, className = "w-6 h-6" }: { icon: string; className?: string }) {
  const size = `${className}`;
  const icons: Record<string, React.ReactNode> = {
    bed: <Bed className={size} />,
    snowflake: <Snowflake className={size} />,
    mountain: <Mountain className={size} />,
    wifi: <Wifi className={size} />,
    car: <Car className={size} />,
    flame: <Flame className={size} />,
    utensils: <Utensils className={size} />,
    star: <Star className={size} />,
    shield: <Shield className={size} />,
    trees: <Trees className={size} />,
    sun: <Sun className={size} />,
    bath: <Bath className={size} />,
  };
  return <>{icons[icon] ?? <Star className={size} />}</>;
}

export default function AdminFeaturesPage() {
  const [cards, setCards] = useState<FeatureCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [toast, setToast] = useState("");
  const [lang, setLang] = useState<LangTab>("en");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [newItemText, setNewItemText] = useState<Record<number, string>>({});

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/feature-card/admin`, { credentials: "include" });
      if (res.status === 401) { window.location.href = "/admin/login"; return; }
      const data = await res.json();
      if (Array.isArray(data)) setCards(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const updateLocal = (id: number, patch: Partial<FeatureCard>) => {
    setCards((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  };

  const saveCard = async (card: FeatureCard) => {
    setSaving((p) => ({ ...p, [card.id]: true }));
    try {
      const res = await fetch(`${API}/feature-card/${card.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          titleEn: card.titleEn,
          titleKa: card.titleKa,
          icon: card.icon,
          itemsEn: card.itemsEn,
          itemsKa: card.itemsKa,
          isVisible: card.isVisible,
          order: card.order,
        }),
      });
      if (!res.ok) { showToast("Save failed"); return; }
      showToast("Card saved!");
    } finally {
      setSaving((p) => ({ ...p, [card.id]: false }));
    }
  };

  const deleteCard = async (id: number) => {
    if (!confirm("Delete this feature card?")) return;
    try {
      await fetch(`${API}/feature-card/${id}`, { method: "DELETE", credentials: "include" });
      setCards((prev) => prev.filter((c) => c.id !== id));
      showToast("Deleted");
    } catch {
      showToast("Delete failed");
    }
  };

  const addCard = async () => {
    setSaving((p) => ({ ...p, new: true }));
    try {
      const res = await fetch(`${API}/feature-card`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          titleEn: "New Section",
          titleKa: "ახალი განყოფილება",
          icon: "star",
          itemsEn: [],
          itemsKa: [],
          isVisible: true,
          order: cards.length,
        }),
      });
      const data = await res.json();
      if (data?.id) {
        setCards((prev) => [...prev, data]);
        setExpandedId(data.id);
      }
    } finally {
      setSaving((p) => ({ ...p, new: false }));
    }
  };

  const addItem = (card: FeatureCard) => {
    const text = newItemText[card.id]?.trim();
    if (!text) return;
    const patch = lang === "en"
      ? { itemsEn: [...card.itemsEn, text] }
      : { itemsKa: [...card.itemsKa, text] };
    updateLocal(card.id, patch);
    setNewItemText((p) => ({ ...p, [card.id]: "" }));
  };

  const removeItem = (card: FeatureCard, index: number) => {
    if (lang === "en") {
      updateLocal(card.id, { itemsEn: card.itemsEn.filter((_, i) => i !== index) });
    } else {
      updateLocal(card.id, { itemsKa: card.itemsKa.filter((_, i) => i !== index) });
    }
  };

  const editItem = (card: FeatureCard, index: number, val: string) => {
    if (lang === "en") {
      const arr = [...card.itemsEn];
      arr[index] = val;
      updateLocal(card.id, { itemsEn: arr });
    } else {
      const arr = [...card.itemsKa];
      arr[index] = val;
      updateLocal(card.id, { itemsKa: arr });
    }
  };

  return (
    <AdminShell>
      <div className="space-y-6 max-w-4xl">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Feature Cards</h1>
            <p className="text-gray-500 text-sm mt-1">Manage the cottage feature cards shown on the homepage — both EN and KA</p>
          </div>
          <button
            onClick={addCard}
            disabled={saving["new"]}
            className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Card
          </button>
        </div>

        {/* Language toggle */}
        <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1 w-fit">
          {(["en", "ka"] as LangTab[]).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                lang === l ? "bg-white text-green-700 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              {l === "en" ? "English" : "ქართული"}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : cards.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Star className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No feature cards yet</p>
            <p className="text-sm mt-1">Click "Add Card" to create your first one</p>
          </div>
        ) : (
          <div className="space-y-4">
            {cards.map((card) => {
              const isExpanded = expandedId === card.id;
              const items = lang === "en" ? card.itemsEn : card.itemsKa;
              const title = lang === "en" ? card.titleEn : card.titleKa;

              return (
                <div
                  key={card.id}
                  className={`bg-white rounded-xl border shadow-sm overflow-hidden transition-all ${
                    card.isVisible ? "border-gray-100" : "border-gray-200 opacity-60"
                  }`}
                >
                  {/* Card header */}
                  <div className="flex items-center gap-3 px-5 py-4">
                    <GripVertical className="w-4 h-4 text-gray-300 shrink-0" />
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${card.isVisible ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"}`}>
                      <IconDisplay icon={card.icon} className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{title || <span className="text-gray-400 italic">Untitled</span>}</p>
                      <p className="text-xs text-gray-400">{items.length} items · {lang.toUpperCase()}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => updateLocal(card.id, { isVisible: !card.isVisible })}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        title={card.isVisible ? "Hide section" : "Show section"}
                      >
                        {card.isVisible ? (
                          <Eye className="w-4 h-4 text-green-600" />
                        ) : (
                          <EyeOff className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : card.id)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                      </button>
                      <button
                        onClick={() => saveCard(card)}
                        disabled={saving[card.id]}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-semibold hover:bg-green-700 disabled:opacity-50 transition-colors"
                      >
                        <Save className="w-3.5 h-3.5" />
                        {saving[card.id] ? "..." : "Save"}
                      </button>
                      <button
                        onClick={() => deleteCard(card.id)}
                        className="p-2 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Expanded editor */}
                  {isExpanded && (
                    <div className="border-t border-gray-100 px-5 py-5 space-y-5 bg-gray-50">
                      {/* Title field */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Title (EN)</label>
                          <input
                            value={card.titleEn}
                            onChange={(e) => updateLocal(card.id, { titleEn: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                            placeholder="English title..."
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">სათაური (KA)</label>
                          <input
                            value={card.titleKa}
                            onChange={(e) => updateLocal(card.id, { titleKa: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                            placeholder="ქართული სათაური..."
                          />
                        </div>
                      </div>

                      {/* Order */}
                      <div className="flex items-center gap-3">
                        <div className="w-32">
                          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Order</label>
                          <input
                            type="number"
                            value={card.order}
                            onChange={(e) => updateLocal(card.id, { order: parseInt(e.target.value) || 0 })}
                            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                            min={0}
                          />
                        </div>
                      </div>

                      {/* Icon picker */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Icon</label>
                        <div className="flex flex-wrap gap-2">
                          {ICONS.map((ic) => (
                            <button
                              key={ic.key}
                              onClick={() => updateLocal(card.id, { icon: ic.key })}
                              title={ic.label}
                              className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
                                card.icon === ic.key
                                  ? "bg-green-600 text-white border-green-700 shadow"
                                  : "bg-white text-gray-500 border-gray-200 hover:border-green-400 hover:text-green-700"
                              }`}
                            >
                              {ic.component}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Items editor (for active language) */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                          Items — {lang === "en" ? "English" : "ქართული"}
                        </label>
                        <div className="space-y-2">
                          {items.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full shrink-0" />
                              <input
                                value={item}
                                onChange={(e) => editItem(card, idx, e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                              />
                              <button
                                onClick={() => removeItem(card, idx)}
                                className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                          <div className="flex items-center gap-2 mt-2">
                            <div className="w-2 h-2 bg-gray-300 rounded-full shrink-0" />
                            <input
                              value={newItemText[card.id] ?? ""}
                              onChange={(e) => setNewItemText((p) => ({ ...p, [card.id]: e.target.value }))}
                              onKeyDown={(e) => { if (e.key === "Enter") addItem(card); }}
                              placeholder={lang === "en" ? "Add item, press Enter..." : "დაამატეთ ელემენტი, Enter..."}
                              className="flex-1 px-3 py-2 border border-dashed border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white focus:border-solid"
                            />
                            <button
                              onClick={() => addItem(card)}
                              className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Save button at bottom of expanded view */}
                      <div className="flex justify-end pt-2">
                        <button
                          onClick={() => saveCard(card)}
                          disabled={saving[card.id]}
                          className="flex items-center gap-2 px-5 py-2 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 disabled:opacity-50 transition-colors"
                        >
                          <Save className="w-4 h-4" />
                          {saving[card.id] ? "Saving..." : "Save Card"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
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
