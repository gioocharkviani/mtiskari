"use client";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import React, { useRef } from "react";
import { motion, Variants, useInView } from "framer-motion";
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
    scale: 0.98,
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
      className={`overflow-hidden ${className}`}
    >
      {children}
    </motion.div>
  );
};

const Gallery: React.FC = () => {
  return (
    <>
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
                Discover the Beauty of Mtiskari
              </motion.span>

              <Link
                href=""
                className="flex-1 bg-green-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-600 transition-colors duration-300 shadow-md hover:shadow-lg"
              >
                See more
              </Link>
            </AnimatedSection>

            <AnimatedSection className="w-full mt-6 overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-5 w-full">
                {images.map((i) => (
                  <motion.div
                    key={i.id}
                    variants={imageVariants}
                    className={`relative  overflow-hidden rounded-4xl h-[300px] ${i.colSpan} group`}
                    whileHover={{
                      scale: 1.02,
                      transition: {
                        duration: 0.3,
                        ease: "easeInOut",
                      },
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
              </div>
            </AnimatedSection>
          </div>
        </section>
      </div>
    </>
  );
};

export default Gallery;
