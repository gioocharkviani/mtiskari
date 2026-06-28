"use client";

import { motion, useInView, Variants } from "framer-motion";
import { useRef } from "react";
import {
  BookNowIcon,
  ContactIcon,
  CottagesIcon,
  GalleryIcon,
  HomeIcon,
} from "@/components/svg/footerIcons";

const BottomNav = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const staggerVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const links = [
    { name: "Home", link: "/", icon: <HomeIcon /> },
    { name: "Cottages", link: "/#details", icon: <CottagesIcon /> },
    { name: "Contact", link: "/#contact", icon: <ContactIcon /> },
    { name: "Gallery", link: "/gallery", icon: <GalleryIcon /> },
    { name: "Book Now", link: "/#hero", icon: <BookNowIcon /> },
  ];

  return (
    <div ref={ref} className="w-full px-6 py-10">
      <div className="max-w-[1500px] mx-auto">
        {/* Heading */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="text-center mb-10"
        >
          <motion.h3
            variants={staggerVariants}
            className="text-4xl font-bold text-green-600 mb-2"
          >
            Mtiskari Cottages
          </motion.h3>
          <motion.p
            variants={staggerVariants}
            className="text-gray-500 text-lg"
          >
            Where mountains meet comfort
          </motion.p>
        </motion.div>

        {/* Nav Links */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="flex flex-wrap justify-center gap-4"
        >
          {links.map((link, index) => (
            <motion.a
              key={index}
              href={link.link}
              variants={staggerVariants}
              whileHover={{
                scale: 1.08,
                y: -4,
                backgroundColor: "rgba(34, 197, 94, 0.08)",
                borderColor: "#10B981",
              }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center gap-2 rounded-xl px-6 py-4 border border-gray-200 bg-white shadow-sm hover:shadow-md transition-colors group min-w-[90px]"
            >
              <div className="text-gray-500 group-hover:text-green-600 transition-colors">
                {link.icon}
              </div>
              <span className="text-sm font-medium text-gray-700 group-hover:text-green-700 transition-colors whitespace-nowrap">
                {link.name}
              </span>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default BottomNav;
