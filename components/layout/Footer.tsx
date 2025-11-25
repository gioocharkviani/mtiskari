"use client";

import { motion, useInView, Variants } from "framer-motion";
import { useRef } from "react";

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

  const pulseVariants: Variants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
    pulse: {
      scale: [1, 1.05, 1],
      transition: { duration: 2, repeat: Infinity },
    },
  };

  const links = [
    {
      name: "Home",
      icon: (
        <svg
          className="w-8 h-8"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    },
    {
      name: "Cottages",
      icon: (
        <svg
          className="w-8 h-8"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      ),
    },
    {
      name: "About",
      icon: (
        <svg
          className="w-8 h-8"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      name: "Contact",
      icon: (
        <svg
          className="w-8 h-8"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      name: "Gallery",
      icon: (
        <svg
          className="w-8 h-8"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      name: "Book Now",
      icon: (
        <svg
          className="w-8 h-8"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
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
          <motion.div
            variants={pulseVariants}
            animate={isInView ? ["visible", "pulse"] : "hidden"}
            className="text-6xl mb-4"
          >
            <svg
              className="w-20 h-20 mx-auto text-green-600"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M14 10l-3-3-3 3-3-3-3 3v12h12V10z" />
              <path
                d="M6 22v-8l3 3 3-3 3 3 3-3v8"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
          </motion.div>
          <motion.h3
            variants={staggerVariants}
            className="text-4xl font-bold text-green-600 mb-2"
          >
            A-Frame Cottages
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
            © {currentYear} A-Frame Cottages. Experience nature like never
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
