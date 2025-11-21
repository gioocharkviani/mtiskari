"use client";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import React from "react";
import { motion, Variants, useInView } from "framer-motion";
import { useRef } from "react";
import test1 from "../../public/test/1.jpg";
import test2 from "../../public/test/2.jpg";
import test3 from "../../public/test/3.jpg";
import test4 from "../../public/test/4.jpg";

interface ImageItem {
  id: number;
  src: string | HTMLImageElement | StaticImageData;
  alt: string;
  colSpan: string;
}

const images: ImageItem[] = [
  {
    id: 1,
    src: test1,
    alt: "Mtiskari landscape 1",
    colSpan: "md:col-span-3",
  },
  {
    id: 2,
    src: test2,
    alt: "Mtiskari landscape 2",
    colSpan: "md:col-span-2",
  },
  {
    id: 3,
    src: test3,
    alt: "Mtiskari landscape 3",
    colSpan: "md:col-span-2",
  },
  {
    id: 4,
    src: test4,
    alt: "Mtiskari landscape 4",
    colSpan: "md:col-span-3",
  },
];

// Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 50,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const imageVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 1.1,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

const buttonVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
      delay: 0.6,
    },
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2,
      ease: "easeInOut",
    },
  },
  tap: {
    scale: 0.95,
  },
};

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
}

const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  className = "",
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    once: true,
    margin: "-100px",
  });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const Gallery: React.FC = () => {
  return (
    <div id="gallery" className="w-full flex bg-transparent! justify-center">
      <div className="max-w-[1500px] w-full px-5  py-10">
        {/* Header Section */}
        <AnimatedSection className="flex w-full flex-col gap-3 items-center justify-center">
          <motion.span
            variants={itemVariants}
            className="font-extrabold text-center text-[42px] w-full leading-12"
          >
            Discover the Beauty of Mtiskari
          </motion.span>

          <motion.div variants={buttonVariants}>
            <Link
              href=""
              className="text-[#041f06] px-4 py-2 rounded-2xl bg-[#cdefcd] font-bold text-[16px] hover:bg-[#b8e0b8] transition-colors duration-300 block"
            >
              See more
            </Link>
          </motion.div>
        </AnimatedSection>

        {/* Gallery Grid */}
        <AnimatedSection className="grid grid-cols-1 md:grid-cols-5 gap-5 mt-6">
          {images.map((i) => (
            <motion.div
              key={i.id}
              variants={imageVariants}
              className={`relative overflow-hidden rounded-4xl h-[300px] ${i.colSpan} group`}
              whileHover={{
                scale: 1.02,
                transition: { duration: 0.3 },
              }}
            >
              <Image
                src={i.src}
                alt={i.alt}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                placeholder="blur"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 60vw"
              />
            </motion.div>
          ))}
        </AnimatedSection>
      </div>
    </div>
  );
};

export default Gallery;
