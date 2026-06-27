"use client";
import React, { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { Plus, Pencil, Trash2, Eye, EyeOff, Save, X, Home } from "lucide-react";

const API = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3001/api/v1";

interface Cottage {
  id: number;
  name: string;
  description?: string;
  maxGuests: number;
  isActive: boolean;
  order: number;
}

const EMPTY: Omit<Cottage, "id"> = {
  name: "",
  description: "",
  maxGuests: 4,
  isActive: true,
  order: 0,
};

export default function AdminCottagesPage() {
  const [cottages, setCottages] = useState<Cottage[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const [modal, setModal] = useState<{ open: boolean; editing: Cottage | null }>({
    open: false,
    editing: null,
  });
  const [form, setForm] = useState<Omit<Cottage, "id">>(EMPTY);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const fetchCottages = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/cottage/admin`, { credentials: "include" });
      if (res.status === 401) { window.location.href = "/admin/login"; return; }
      const data = await res.json();
      if (Array.isArray(data)) setCottages(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCottages(); }, []);

  const openAdd = () => {
    setForm({ ...EMPTY, order: cottages.length });
    setModal({ open: true, editing: null });
  };

  const openEdit = (c: Cottage) => {
    setForm({ name: c.name, description: c.description ?? "", maxGuests: c.maxGuests, isActive: c.isActive, order: c.order });
    setModal({ open: true, editing: c });
  };

  const closeModal = () => setModal({ open: false, editing: null });

  const save = async () => {
    if (!form.name.trim()) { showToast("Name is required"); return; }
    setSaving(true);
    try {
      const editing = modal.editing;
      const res = editing
        ? await fetch(`${API}/cottage/${editing.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(form),
          })
        : await fetch(`${API}/cottage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(form),
          });
      if (!res.ok) { showToast("Failed to save"); return; }
      showToast(editing ? "Cottage updated!" : "Cottage added!");
      closeModal();
      fetchCottages();
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (c: Cottage) => {
    try {
      await fetch(`${API}/cottage/${c.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ isActive: !c.isActive }),
      });
      setCottages((prev) => prev.map((x) => x.id === c.id ? { ...x, isActive: !x.isActive } : x));
      showToast(c.isActive ? "Hidden from guests" : "Now visible to guests");
    } catch {
      showToast("Update failed");
    }
  };

  const deleteCottage = async (c: Cottage) => {
    if (cottages.length <= 1) { showToast("Cannot delete the last cottage"); return; }
    if (!confirm(`Delete "${c.name}"? This cannot be undone.`)) return;
    try {
      await fetch(`${API}/cottage/${c.id}`, { method: "DELETE", credentials: "include" });
      setCottages((prev) => prev.filter((x) => x.id !== c.id));
      showToast("Cottage deleted");
    } catch {
      showToast("Delete failed");
    }
  };

  return (
    <AdminShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Cottages</h1>
            <p className="text-gray-500 text-sm mt-1">
              {cottages.length} cottage{cottages.length !== 1 ? "s" : ""} ·{" "}
              {cottages.filter((c) => c.isActive).length} active
            </p>
          </div>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Cottage
          </button>
        </div>

        {/* Info banner */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl px-5 py-4 text-sm text-blue-700">
          <strong>Multi-cottage mode</strong> is controlled from{" "}
          <a href="/admin/settings" className="underline font-semibold">
            Settings
          </a>
          . When turned ON, guests will see a cottage selection step before booking.
          When OFF, only one cottage is shown (existing single-cottage behaviour).
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-28 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : cottages.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 p-16 text-center">
            <Home className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 font-medium">No cottages yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {cottages.map((c) => (
              <div
                key={c.id}
                className={`bg-white rounded-xl border shadow-sm p-5 flex items-start gap-4 transition-opacity ${
                  c.isActive ? "border-gray-100" : "border-orange-200 opacity-60"
                }`}
              >
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center shrink-0">
                  <Home className="w-6 h-6 text-green-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900 truncate">{c.name}</h3>
                    {!c.isActive && (
                      <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-medium">
                        Hidden
                      </span>
                    )}
                  </div>
                  {c.description && (
                    <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">{c.description}</p>
                  )}
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                    <span>Max {c.maxGuests} guests</span>
                    <span>Order #{c.order}</span>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => toggleActive(c)}
                    title={c.isActive ? "Hide" : "Show"}
                    className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                  >
                    {c.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4 text-orange-500" />}
                  </button>
                  <button
                    onClick={() => openEdit(c)}
                    title="Edit"
                    className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteCottage(c)}
                    title="Delete"
                    className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {modal.open && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">
                {modal.editing ? "Edit Cottage" : "Add New Cottage"}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">
                  Name *
                </label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g. Mountain Suite"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                  placeholder="Short description shown to guests..."
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">
                    Max Guests
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={form.maxGuests}
                    onChange={(e) => setForm((f) => ({ ...f, maxGuests: parseInt(e.target.value) || 1 }))}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={form.order}
                    onChange={(e) => setForm((f) => ({ ...f, order: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  onClick={() => setForm((f) => ({ ...f, isActive: !f.isActive }))}
                  className={`relative w-10 h-6 rounded-full transition-colors ${form.isActive ? "bg-green-500" : "bg-gray-300"}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${form.isActive ? "left-5" : "left-1"}`} />
                </div>
                <span className="text-sm text-gray-700 font-medium">
                  {form.isActive ? "Visible to guests" : "Hidden from guests"}
                </span>
              </label>
            </div>
            <div className="flex gap-2 px-6 pb-6">
              <button
                onClick={save}
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                <Save className="w-4 h-4" />
                {saving ? "Saving..." : "Save"}
              </button>
              <button
                onClick={closeModal}
                className="px-4 py-2.5 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 bg-green-700 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium z-50">
          {toast}
        </div>
      )}
    </AdminShell>
  );
}
