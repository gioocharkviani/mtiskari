"use client";

import { motion, useInView, Variants } from "framer-motion";
import { useRef } from "react";
import {
  AboutIcon,
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
    {
      name: "Home",
      link: "/",
      icon: <HomeIcon />,
    },
    {
      name: "Cottages",
      link: "/#details",
      icon: <CottagesIcon />,
    },
    {
      name: "Contact",
      link: "/#contact",
      icon: <ContactIcon />,
    },
    {
      name: "Gallery",
      link: "/gallery",
      icon: <GalleryIcon />,
    },
    {
      name: "Book Now",
      link: "/#hero",
      icon: <BookNowIcon />,
    },
  ];

  return (
    <div ref={ref} className="w-full px-5">
      <div className="max-w-[1500px] mx-auto">
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="text-center mb-12"
        >
          <motion.h3
            variants={staggerVariants}
            className="text-4xl font-bold text-green-600 mb-2"
          >
            Mtiskari Cottages
          </motion.h3>
          <motion.p
            variants={staggerVariants}
            className="text-gray-600 text-lg"
          >
            Where mountains meet comfort
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8 mx-auto"
        >
          {links.map((link, index) => (
            <motion.a
              key={index}
              href="#"
              variants={staggerVariants}
              whileHover={{
                scale: 1.1,
                y: -5,
                backgroundColor: "rgba(34, 197, 94, 0.1)",
                borderColor: "#10B981",
              }}
              whileTap={{ scale: 0.95 }}
              className="rounded-lg p-4 text-center border border-gray-200 cursor-pointer transition-colors hover:shadow-md group"
            >
              <div className="flex justify-center mb-2 text-gray-600 group-hover:text-green-600 transition-colors">
                {link.icon}
              </div>
              <span className="text-sm text-gray-700 font-medium group-hover:text-green-700 transition-colors">
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
