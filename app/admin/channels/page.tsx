"use client";
import React, { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { Plus, Pencil, Trash2, ToggleRight, ToggleLeft, Globe } from "lucide-react";

const API = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3001/api/v1";

interface Channel {
  id: number;
  name: string;
  color: string;
  isActive: boolean;
  createdAt: string;
}

const PRESET_COLORS = [
  { name: "Booking.com Blue", hex: "#003580" },
  { name: "Airbnb Red", hex: "#FF5A5F" },
  { name: "Purple", hex: "#6366f1" },
  { name: "Green", hex: "#16a34a" },
  { name: "Orange", hex: "#ea580c" },
  { name: "Teal", hex: "#0891b2" },
];

function ChannelModal({
  channel,
  onClose,
  onSaved,
}: {
  channel?: Channel | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [name, setName] = useState(channel?.name ?? "");
  const [color, setColor] = useState(channel?.color ?? "#6366f1");
  const [isActive, setIsActive] = useState(channel?.isActive ?? true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!name.trim()) { setError("Channel name is required"); return; }
    setSaving(true);
    setError("");
    try {
      const url = channel ? `${API}/channel/${channel.id}` : `${API}/channel`;
      const method = channel ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: name.trim(), color, isActive }),
      });
      if (!res.ok) { setError("Failed to save channel"); return; }
      onSaved();
      onClose();
    } catch {
      setError("Failed to save channel");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">
            {channel ? "Edit Channel" : "Add Booking Channel"}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Booking channels like Booking.com, Airbnb, etc.
          </p>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Channel Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Booking.com, Airbnb, Direct..."
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Channel Color</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c.hex}
                  onClick={() => setColor(c.hex)}
                  title={c.name}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    color === c.hex ? "border-gray-800 scale-110" : "border-transparent"
                  }`}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-10 h-10 rounded-lg cursor-pointer border border-gray-200"
              />
              <span className="text-sm text-gray-500 font-mono">{color}</span>
              <div
                className="flex-1 h-8 rounded-lg"
                style={{ backgroundColor: color }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Active</p>
              <p className="text-xs text-gray-400">Show this channel in the booking form</p>
            </div>
            <button onClick={() => setIsActive(!isActive)}>
              {isActive ? (
                <ToggleRight className="w-9 h-9 text-green-500" />
              ) : (
                <ToggleLeft className="w-9 h-9 text-gray-300" />
              )}
            </button>
          </div>

          {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
        </div>

        <div className="p-6 pt-0 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {saving ? "Saving..." : channel ? "Save Changes" : "Add Channel"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminChannelsPage() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Channel | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);

  const fetchChannels = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/channel/all`, { credentials: "include" });
      if (res.ok) setChannels(await res.json());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchChannels(); }, []);

  const toggleActive = async (ch: Channel) => {
    await fetch(`${API}/channel/${ch.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ isActive: !ch.isActive }),
    });
    fetchChannels();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this channel? Existing bookings won't be affected.")) return;
    setDeleting(id);
    try {
      await fetch(`${API}/channel/${id}`, { method: "DELETE", credentials: "include" });
      fetchChannels();
    } finally {
      setDeleting(null);
    }
  };

  return (
    <AdminShell>
      <div className="p-6 max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Booking Channels</h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage external booking channels (Booking.com, Airbnb, etc.)
            </p>
          </div>
          <button
            onClick={() => { setEditing(null); setShowModal(true); }}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Channel
          </button>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 text-sm text-blue-700">
          <strong>How it works:</strong> When a guest books from one of these channels, go to Bookings → Add External Booking and select the channel. The dates will be blocked on your calendar automatically.
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : channels.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <Globe className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No channels yet</p>
            <p className="text-sm text-gray-400 mt-1">Add your first booking channel to get started</p>
          </div>
        ) : (
          <div className="space-y-3">
            {channels.map((ch) => (
              <div
                key={ch.id}
                className="bg-white border border-gray-100 rounded-xl px-5 py-4 flex items-center gap-4 shadow-sm"
              >
                <div
                  className="w-10 h-10 rounded-full flex-shrink-0 border-2 border-white shadow"
                  style={{ backgroundColor: ch.color }}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900">{ch.name}</p>
                  <p className="text-xs text-gray-400 font-mono">{ch.color}</p>
                </div>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    ch.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {ch.isActive ? "Active" : "Inactive"}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => toggleActive(ch)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title={ch.isActive ? "Deactivate" : "Activate"}
                  >
                    {ch.isActive ? (
                      <ToggleRight className="w-5 h-5 text-green-500" />
                    ) : (
                      <ToggleLeft className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                  <button
                    onClick={() => { setEditing(ch); setShowModal(true); }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Pencil className="w-4 h-4 text-gray-400" />
                  </button>
                  <button
                    onClick={() => handleDelete(ch.id)}
                    disabled={deleting === ch.id}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <ChannelModal
          channel={editing}
          onClose={() => setShowModal(false)}
          onSaved={fetchChannels}
        />
      )}
    </AdminShell>
  );
}
