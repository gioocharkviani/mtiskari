"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useRef, useEffect, useState } from "react";
import { motion, Variants, useInView } from "framer-motion";
import { ImageIcon } from "lucide-react";
import { useContent } from "@/context/ContentContext";

const API =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://205.209.110.121:3350/api/v1";
const SERVER = API.replace(/\/api\/v1\/?$/, "");

interface ApiPhoto {
  id: number;
  url: string;
  title?: string;
  originalName: string;
}

interface ImageItem {
  id: number;
  src: string;
  alt: string;
  colSpan: string;
}

const COL_SPANS = [
  "md:col-span-3",
  "md:col-span-2",
  "md:col-span-2",
  "md:col-span-3",
];

const placeholderSlots = COL_SPANS.map((colSpan, idx) => ({
  id: idx + 1,
  colSpan,
}));

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.3 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const imageVariants: Variants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const AnimatedSection: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
      className={`overflow-hidden ${className}`}
    >
      {children}
    </motion.div>
  );
};

const Gallery: React.FC = () => {
  const { t } = useContent();
  const [images, setImages] = useState<ImageItem[]>([]);

  useEffect(() => {
    fetch(`${API}/file/gallery`)
      .then((r) => r.json())
      .then((data: ApiPhoto[]) => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped: ImageItem[] = data.slice(0, 4).map((photo, idx) => ({
            id: photo.id,
            src: `${SERVER}${photo.url}`,
            alt: photo.title || photo.originalName,
            colSpan: COL_SPANS[idx % 4],
          }));
          setImages(mapped);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="w-full overflow-x-hidden">
      <section
        id="gallery"
        className="w-full flex justify-center bg-transparent relative"
      >
        <div className="w-full max-w-[1500px] px-5 py-10">
          <AnimatedSection className="flex w-full flex-col gap-3 items-center justify-center">
            <motion.span
              variants={itemVariants}
              className="font-extrabold text-center text-3xl md:text-[42px] w-full leading-tight px-2"
            >
              {t("gallery_title", "Discover the Beauty of Mtiskari")}
            </motion.span>
            <Link
              href="/gallery"
              className="flex-1 bg-green-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-600 transition-colors duration-300 shadow-md hover:shadow-lg"
            >
              {t("gallery_btn", "See more")}
            </Link>
          </AnimatedSection>

          <AnimatedSection className="w-full mt-6 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-5 w-full">
              {images.length > 0
                ? images.map((img) => (
                    <motion.div
                      key={img.id}
                      variants={imageVariants}
                      className={`relative overflow-hidden rounded-4xl h-[300px] ${img.colSpan} group`}
                      whileHover={{
                        scale: 1.02,
                        transition: { duration: 0.3, ease: "easeInOut" },
                      }}
                    >
                      <Image
                        src={img.src}
                        alt={img.alt}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 60vw"
                      />
                    </motion.div>
                  ))
                : placeholderSlots.map((slot) => (
                    <motion.div
                      key={slot.id}
                      variants={imageVariants}
                      className={`relative overflow-hidden rounded-4xl h-[300px] ${slot.colSpan} bg-gray-100 flex items-center justify-center`}
                    >
                      <ImageIcon className="w-10 h-10 text-gray-300" />
                    </motion.div>
                  ))}
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
};

export default Gallery;
