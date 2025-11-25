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

const Footer = () => {
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
      icon: <HomeIcon />,
    },
    {
      name: "Cottages",
      icon: <CottagesIcon />,
    },
    {
      name: "About",
      icon: <AboutIcon />,
    },
    {
      name: "Contact",
      icon: <ContactIcon />,
    },
    {
      name: "Gallery",
      icon: <GalleryIcon />,
    },
    {
      name: "Book Now",
      icon: <BookNowIcon />,
    },
  ];

  const currentYear = new Date().getFullYear();

  return (
    <footer
      ref={ref}
      className="w-full py-16 px-5 bg-white border-t border-gray-100"
    >
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
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12"
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

        {/* Bottom Section */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="border-t border-gray-200 pt-8 text-center"
        >
          <motion.p variants={staggerVariants} className="text-gray-500 mb-4">
            © {currentYear} Mtiskari Cottage. Experience nature like never
            before.
          </motion.p>
          <motion.div
            variants={staggerVariants}
            className="flex justify-center space-x-6 text-sm text-gray-500"
          >
            <motion.a
              whileHover={{ color: "#10B981", scale: 1.05 }}
              href="#"
              className="font-medium"
            >
              Privacy
            </motion.a>
            <motion.a
              whileHover={{ color: "#10B981", scale: 1.05 }}
              href="#"
              className="font-medium"
            >
              Terms
            </motion.a>
            <motion.a
              whileHover={{ color: "#10B981", scale: 1.05 }}
              href="#"
              className="font-medium"
            >
              Accessibility
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
