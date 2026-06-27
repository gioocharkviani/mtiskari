"use client";
import React, { useEffect, useRef, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import Image from "next/image";
import {
  Upload,
  Trash2,
  Eye,
  EyeOff,
  RefreshCw,
  ImageIcon,
  X,
  Edit2,
  Save,
} from "lucide-react";

const API =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://205.209.110.121:3350/api/v1";
const SERVER = process.env.SERVER_URL || "http://205.209.110.121:3350";

interface Photo {
  id: number;
  filename: string;
  originalName: string;
  title?: string;
  description?: string;
  url: string;
  order: number;
  isVisible: boolean;
  createdAt?: string;
}

export default function AdminGalleryPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState("");
  const [preview, setPreview] = useState<Photo | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Upload form state
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadDesc, setUploadDesc] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const fetchPhotos = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/file/gallery/admin`, {
        credentials: "include",
      });
      if (res.status === 401) {
        window.location.href = "/admin/login";
        return;
      }
      const data = await res.json();
      if (Array.isArray(data)) setPhotos(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      showToast("Only image files allowed");
      return;
    }
    setUploading(true);
    try {
      const form = new FormData();
      form.append("image", file);
      if (uploadTitle) form.append("title", uploadTitle);
      if (uploadDesc) form.append("description", uploadDesc);

      const res = await fetch(`${API}/file/uploadGallery`, {
        method: "POST",
        credentials: "include",
        body: form,
      });

      if (!res.ok) {
        showToast("Upload failed");
        return;
      }

      setUploadTitle("");
      setUploadDesc("");
      showToast("Photo uploaded!");
      fetchPhotos();
    } finally {
      setUploading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  const deletePhoto = async (id: number) => {
    if (!confirm("Delete this photo?")) return;
    try {
      await fetch(`${API}/file/gallery/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      setPhotos((p) => p.filter((ph) => ph.id !== id));
      showToast("Photo deleted");
    } catch {
      showToast("Delete failed");
    }
  };

  const toggleVisibility = async (photo: Photo) => {
    try {
      await fetch(`${API}/file/gallery/${photo.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ isVisible: !photo.isVisible }),
      });
      setPhotos((p) =>
        p.map((ph) =>
          ph.id === photo.id ? { ...ph, isVisible: !ph.isVisible } : ph,
        ),
      );
      showToast(photo.isVisible ? "Hidden from gallery" : "Visible in gallery");
    } catch {
      showToast("Update failed");
    }
  };

  const saveEdit = async (id: number) => {
    try {
      await fetch(`${API}/file/gallery/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ title: editTitle, description: editDesc }),
      });
      setPhotos((p) =>
        p.map((ph) =>
          ph.id === id
            ? { ...ph, title: editTitle, description: editDesc }
            : ph,
        ),
      );
      setEditId(null);
      showToast("Updated!");
    } catch {
      showToast("Update failed");
    }
  };

  const startEdit = (photo: Photo) => {
    setEditId(photo.id);
    setEditTitle(photo.title || "");
    setEditDesc(photo.description || "");
  };

  return (
    <AdminShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gallery</h1>
            <p className="text-gray-500 text-sm mt-1">
              {photos.length} photo{photos.length !== 1 ? "s" : ""} ·{" "}
              {photos.filter((p) => p.isVisible).length} visible
            </p>
          </div>
          <button
            onClick={fetchPhotos}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* Upload area */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Upload New Photo</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Title (optional)
              </label>
              <input
                value={uploadTitle}
                onChange={(e) => setUploadTitle(e.target.value)}
                placeholder="Photo title"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Description (optional)
              </label>
              <input
                value={uploadDesc}
                onChange={(e) => setUploadDesc(e.target.value)}
                placeholder="Short description"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => !uploading && fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${
              dragOver
                ? "border-green-500 bg-green-50"
                : "border-gray-300 hover:border-green-400 hover:bg-green-50/50"
            } ${uploading ? "opacity-60 cursor-not-allowed" : ""}`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleInputChange}
            />
            <Upload className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-sm font-medium text-gray-600">
              {uploading ? "Uploading..." : "Click or drag & drop to upload"}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              JPEG, PNG, WEBP — max 10MB
            </p>
          </div>
        </div>

        {/* Photos grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="aspect-square bg-gray-100 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : photos.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-16 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ImageIcon className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-gray-400 font-medium">No photos yet</p>
            <p className="text-gray-300 text-sm mt-1">
              Upload your first photo above
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className={`bg-white rounded-xl overflow-hidden border shadow-sm group transition-all ${
                  photo.isVisible
                    ? "border-gray-100"
                    : "border-orange-200 opacity-70"
                }`}
              >
                <div
                  className="relative aspect-square cursor-pointer bg-gray-100"
                  onClick={() => setPreview(photo)}
                >
                  <Image
                    src={`${SERVER}${photo.url}`}
                    alt={photo.title || photo.originalName}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                    unoptimized
                  />
                  {!photo.isVisible && (
                    <div className="absolute inset-0 bg-gray-900/30 flex items-center justify-center">
                      <span className="bg-black/60 text-white text-xs px-2 py-1 rounded">
                        Hidden
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                </div>

                {editId === photo.id ? (
                  <div className="p-3 space-y-2">
                    <input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      placeholder="Title"
                      className="w-full text-xs px-2 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500"
                    />
                    <input
                      value={editDesc}
                      onChange={(e) => setEditDesc(e.target.value)}
                      placeholder="Description"
                      className="w-full text-xs px-2 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500"
                    />
                    <div className="flex gap-1">
                      <button
                        onClick={() => saveEdit(photo.id)}
                        className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-green-600 text-white rounded-lg text-xs hover:bg-green-700"
                      >
                        <Save className="w-3 h-3" /> Save
                      </button>
                      <button
                        onClick={() => setEditId(null)}
                        className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs hover:bg-gray-200"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-3">
                    <p className="text-xs font-semibold text-gray-800 truncate">
                      {photo.title || photo.originalName}
                    </p>
                    {photo.description && (
                      <p className="text-xs text-gray-400 truncate mt-0.5">
                        {photo.description}
                      </p>
                    )}
                    <div className="flex gap-1 mt-2">
                      <button
                        onClick={() => startEdit(photo)}
                        className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs hover:bg-gray-200 transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => toggleVisibility(photo)}
                        className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs hover:bg-gray-200 transition-colors"
                        title={photo.isVisible ? "Hide" : "Show"}
                      >
                        {photo.isVisible ? (
                          <Eye className="w-3 h-3" />
                        ) : (
                          <EyeOff className="w-3 h-3 text-orange-500" />
                        )}
                      </button>
                      <button
                        onClick={() => deletePhoto(photo.id)}
                        className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-red-50 text-red-500 rounded-lg text-xs hover:bg-red-100 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Preview modal */}
      {preview && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setPreview(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreview(null)}
              className="absolute -top-10 right-0 text-white/70 hover:text-white text-3xl leading-none z-10"
            >
              ×
            </button>
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden">
              <Image
                src={`${SERVER}${preview.url}`}
                alt={preview.title || preview.originalName}
                fill
                className="object-contain"
                sizes="90vw"
                unoptimized
              />
            </div>
            <div className="mt-3 text-center">
              <p className="text-white font-semibold">
                {preview.title || preview.originalName}
              </p>
              {preview.description && (
                <p className="text-white/70 text-sm">{preview.description}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-green-700 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium z-50">
          {toast}
        </div>
      )}
    </AdminShell>
  );
}
