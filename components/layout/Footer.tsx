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

  const currentYear = new Date().getFullYear();

  return (
    <footer ref={ref} className="w-full py-10 px-5">
      <div className="max-w-[1500px] mx-auto">
        {/* Bottom Section */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="border-t border-gray-200 pt-8 text-center"
        >
          <motion.p variants={staggerVariants} className="text-gray-500 mb-2">
            © {currentYear} Mtiskari Cottage. Experience nature like never
            before.
          </motion.p>
          <motion.p variants={staggerVariants} className="text-gray-400 text-sm mb-4">
            Website made by{" "}
            <a
              href="https://bytz.ge"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 hover:text-green-700 font-medium transition-colors"
            >
              bytz.ge
            </a>
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
