"use client";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import React, { useRef, useEffect, useState } from "react";
import { motion, Variants, useInView } from "framer-motion";
import { useContent } from "@/context/ContentContext";
import test1 from "../../public/test/1.jpg";
import test2 from "../../public/test/2.jpg";
import test3 from "../../public/test/3.jpg";
import test4 from "../../public/test/4.jpg";

const API =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3001/api/v1";
const SERVER = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3001";

interface ApiPhoto {
  id: number;
  url: string;
  title?: string;
  originalName: string;
}

interface ImageItem {
  id: number;
  src: string | StaticImageData;
  alt: string;
  colSpan: string;
  isExternal?: boolean;
}

const COL_SPANS = [
  "md:col-span-3",
  "md:col-span-2",
  "md:col-span-2",
  "md:col-span-3",
];

const fallbackImages: ImageItem[] = [
  { id: 1, src: test1, alt: "Mtiskari landscape 1", colSpan: COL_SPANS[0] },
  { id: 2, src: test2, alt: "Mtiskari landscape 2", colSpan: COL_SPANS[1] },
  { id: 3, src: test3, alt: "Mtiskari landscape 3", colSpan: COL_SPANS[2] },
  { id: 4, src: test4, alt: "Mtiskari landscape 4", colSpan: COL_SPANS[3] },
];

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
  const [images, setImages] = useState<ImageItem[]>(fallbackImages);

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
            isExternal: true,
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
              className="font-extrabold text-center text-[42px] w-full leading-12"
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
              {images.map((img) => (
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
                    {...(!img.isExternal && { placeholder: "blur" })}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 60vw"
                    unoptimized={img.isExternal}
                  />
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
