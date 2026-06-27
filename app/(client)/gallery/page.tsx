"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useContent } from "@/context/ContentContext";

const API =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://205.209.110.121:3351/api/v1";
const SERVER = process.env.SERVER_URL || "http://205.209.110.121:3351";

interface Photo {
  id: number;
  title?: string;
  description?: string;
  url: string;
  originalName: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const GalleryPage = () => {
  const { t } = useContent();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const res = await fetch(`${API}/file/gallery`);
        const data = await res.json();
        if (Array.isArray(data)) setPhotos(data);
      } catch {
        // silently handle
      } finally {
        setLoading(false);
      }
    };
    fetchPhotos();
  }, []);

  const hasPhotos = photos.length > 0;

  return (
    <>
      {/* Fullscreen Zoom Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl w-full max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute -top-10 right-0 text-white/70 hover:text-white text-3xl leading-none z-10"
                onClick={() => setSelectedPhoto(null)}
              >
                ×
              </button>

              <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-gray-900">
                {hasPhotos && (
                  <Image
                    src={`${SERVER}${selectedPhoto.url}`}
                    alt={selectedPhoto.title || selectedPhoto.originalName}
                    fill
                    className="object-contain"
                    sizes="90vw"
                    unoptimized
                  />
                )}
              </div>

              <div className="mt-4 text-center">
                <h3 className="text-xl font-bold text-white">
                  {selectedPhoto.title || selectedPhoto.originalName}
                </h3>
                {selectedPhoto.description && (
                  <p className="text-white/60 text-sm mt-1">
                    {selectedPhoto.description}
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Gallery */}
      <div className="pt-32 min-h-screen w-full bg-white">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              {t("gallery_page_title", "Mtiskari Gallery")}
            </h1>
            <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              {t(
                "gallery_page_subtitle",
                "Immerse yourself in the breathtaking beauty of Mtiskari through our collection of stunning photographs",
              )}
            </p>
          </motion.div>

          {/* Gallery Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-96 rounded-2xl bg-gray-100 animate-pulse"
                />
              ))}
            </div>
          ) : !hasPhotos ? (
            <div className="text-center py-24 text-gray-400">
              <div className="text-6xl mb-4 opacity-30">📷</div>
              <p className="text-xl font-medium">
                {t("gallery_page_empty_title", "Gallery coming soon")}
              </p>
              <p className="text-sm mt-2">
                {t(
                  "gallery_page_empty_subtitle",
                  "Photos will appear here once uploaded by the admin",
                )}
              </p>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
            >
              {photos.map((photo) => (
                <motion.div
                  key={photo.id}
                  variants={itemVariants}
                  className="group relative cursor-pointer"
                  onClick={() => setSelectedPhoto(photo)}
                  onMouseEnter={() => setHoveredId(photo.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 h-96 bg-gray-100">
                    <Image
                      src={`${SERVER}${photo.url}`}
                      alt={photo.title || photo.originalName}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      unoptimized
                    />

                    {/* Overlay */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: hoveredId === photo.id ? 1 : 0 }}
                      className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent"
                    />

                    {/* Info Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 transform transition-transform duration-300">
                      <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 transform transition-all duration-300 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">
                          {photo.title || photo.originalName}
                        </h3>
                        {photo.description && (
                          <p className="text-gray-600 text-sm truncate">
                            {photo.description}
                          </p>
                        )}
                        <span className="text-green-600 font-medium text-sm block mt-1">
                          {t("gallery_page_zoom_label", "Click to zoom")}
                        </span>
                      </div>
                    </div>

                    {/* Zoom Icon */}
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{
                        scale: hoveredId === photo.id ? 1 : 0,
                        opacity: hoveredId === photo.id ? 1 : 0,
                      }}
                      className="absolute top-4 right-4 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg"
                    >
                      <svg
                        className="w-6 h-6 text-gray-700"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                        />
                      </svg>
                    </motion.div>
                  </div>

                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-green-400/30 rounded-2xl transition-all duration-300 pointer-events-none" />
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-20 mb-10"
          >
            <div className="bg-linear-to-r from-green-50 to-emerald-50 rounded-3xl p-8 md:p-12">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                {[
                  {
                    value: hasPhotos ? photos.length : "—",
                    label: "Beautiful Images",
                  },
                  { value: "4K", label: "High Resolution" },
                  { value: "Utsera", label: "Location" },
                  { value: "100%", label: "Natural Beauty" },
                ].map(({ value, label }) => (
                  <div key={label} className="text-center">
                    <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">
                      {value}
                    </div>
                    <div className="text-gray-700 font-medium">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div> */}

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-center py-12"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {t("gallery_page_cta_title", "Experience Mtiskari in Person")}
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              {t(
                "gallery_page_cta_desc",
                "These photos capture just a glimpse of what awaits you. Come see the beauty for yourself.",
              )}
            </p>
            <Link
              href="/"
              className="inline-block px-8 py-3 bg-green-600 text-white rounded-full font-medium hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl"
            >
              {t("gallery_page_cta_btn", "Plan Your Visit")}
            </Link>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default GalleryPage;
