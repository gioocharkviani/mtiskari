"use client";
import React, { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";

const galleryImages = [
  {
    id: 1,
    src: "/images/gallery1.jpg",
    title: "Mountain Sunrise",
    location: "Mtiskari Peak",
  },
  {
    id: 2,
    src: "/images/gallery2.jpg",
    title: "Forest Trail",
    location: "Pine Valley",
  },
  {
    id: 3,
    src: "/images/gallery3.jpg",
    title: "Lake Reflection",
    location: "Crystal Lake",
  },
  {
    id: 4,
    src: "/images/gallery4.jpg",
    title: "Cabin View",
    location: "Woodland Retreat",
  },
  {
    id: 5,
    src: "/images/gallery5.jpg",
    title: "Evening Glow",
    location: "Sunset Point",
  },
  {
    id: 6,
    src: "/images/gallery6.jpg",
    title: "Wildlife",
    location: "Nature Reserve",
  },
  {
    id: 7,
    src: "/images/gallery7.jpg",
    title: "River Flow",
    location: "Mountain Stream",
  },
  {
    id: 8,
    src: "/images/gallery8.jpg",
    title: "Hiking Path",
    location: "Adventure Trail",
  },
  {
    id: 9,
    src: "/images/gallery9.jpg",
    title: "Valley Mist",
    location: "Morning Valley",
  },
  {
    id: 10,
    src: "/images/gallery10.jpg",
    title: "Camp Site",
    location: "Forest Camp",
  },
  {
    id: 11,
    src: "/images/gallery11.jpg",
    title: "Panoramic View",
    location: "Observation Deck",
  },
  {
    id: 12,
    src: "/images/gallery12.jpg",
    title: "Star Night",
    location: "Sky Watch Point",
  },
];

const GalleryPage = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [hoveredImage, setHoveredImage] = useState<number | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const selectedImageData = galleryImages.find(
    (img) => img.id === selectedImage
  );

  return (
    <>
      {/* Fullscreen Zoom Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-6xl w-full max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                className="absolute top-4 right-4 z-50 text-gray-600 hover:text-gray-900 text-2xl bg-white/90 hover:bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition-all"
                onClick={() => setSelectedImage(null)}
              >
                ✕
              </button>

              {/* Image Container */}
              <div className="relative w-full h-[70vh] bg-linear-to-br from-green-50 to-emerald-100">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="text-8xl mb-6 opacity-20">🏞️</div>
                    <h2 className="text-4xl font-bold text-gray-900 mb-3">
                      {selectedImageData?.title}
                    </h2>
                    <p className="text-gray-600 text-lg">
                      {selectedImageData?.location}
                    </p>
                  </div>
                </div>
              </div>

              {/* Info Panel */}
              <div className="p-8 border-t">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {selectedImageData?.title}
                    </h3>
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-2 text-gray-600">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        {selectedImageData?.location}
                      </span>
                      <span className="text-gray-500">•</span>
                      <span className="text-gray-600">
                        Image #{selectedImage}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-3"></div>
                </div>
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
              Mtiskari <span className="text-green-600">Gallery</span>
            </h1>
            <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              Immerse yourself in the breathtaking beauty of Mtiskari through
              our collection of stunning photographs
            </p>
          </motion.div>

          {/* Gallery Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          >
            {galleryImages.map((image) => (
              <motion.div
                key={image.id}
                variants={itemVariants}
                className="group relative cursor-pointer"
                onClick={() => setSelectedImage(image.id)}
                onMouseEnter={() => setHoveredImage(image.id)}
                onMouseLeave={() => setHoveredImage(null)}
              >
                {/* Image Card */}
                <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 h-96">
                  {/* Image Container */}
                  <div className="absolute inset-0 bg-linear-to-br from-green-100 to-emerald-200">
                    {/* Decorative Pattern */}
                    <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_30%_30%,#000_1px,transparent_0)] bg-size-[30px_30px]" />

                    {/* Center Content */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center p-8">
                        <div className="text-6xl mb-4 opacity-80">📸</div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                          {image.title}
                        </h3>
                        <p className="text-gray-700">{image.location}</p>
                      </div>
                    </div>
                  </div>

                  {/* Overlay */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: hoveredImage === image.id ? 1 : 0 }}
                    className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent"
                  />

                  {/* Info Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 transform transition-transform duration-300 group-hover:translate-y-0">
                    <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 transform transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        {image.title}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 text-sm">
                          {image.location}
                        </span>
                        <span className="text-green-600 font-medium text-sm">
                          Click to zoom
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Zoom Icon */}
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{
                      scale: hoveredImage === image.id ? 1 : 0,
                      opacity: hoveredImage === image.id ? 1 : 0,
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

                  {/* Image Number */}
                  <div className="absolute top-4 left-4">
                    <div className="w-8 h-8 bg-white/90 text-gray-700 rounded-full flex items-center justify-center text-sm font-bold">
                      {image.id}
                    </div>
                  </div>
                </div>

                {/* Border Effect */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-green-400/30 rounded-2xl transition-all duration-300 pointer-events-none" />
              </motion.div>
            ))}
          </motion.div>

          {/* Gallery Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-20 mb-10"
          >
            <div className="bg-linear-to-r from-green-50 to-emerald-50 rounded-3xl p-8 md:p-12">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">
                    {galleryImages.length}
                  </div>
                  <div className="text-gray-700 font-medium">
                    Beautiful Images
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">
                    4K
                  </div>
                  <div className="text-gray-700 font-medium">
                    High Resolution
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">
                    12
                  </div>
                  <div className="text-gray-700 font-medium">
                    Unique Locations
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">
                    100%
                  </div>
                  <div className="text-gray-700 font-medium">
                    Natural Beauty
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-center py-12"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Experience Mtiskari in Person
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              These photos capture just a glimpse of what awaits you. Come see
              the beauty for yourself.
            </p>
            <button className="px-8 py-3 bg-green-600 text-white rounded-full font-medium hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl">
              Plan Your Visit
            </button>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default GalleryPage;
