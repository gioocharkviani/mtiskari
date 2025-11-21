"use client";
import Link from "next/link";
import React from "react";
import { motion, Variants } from "framer-motion";

interface NavigationItem {
  id: number;
  link: string;
  titleGE: string;
  titleEN: string;
}

const navigationItems: NavigationItem[] = [
  {
    id: 1,
    link: "/",
    titleGE: "მთავარი",
    titleEN: "Home",
  },
  {
    id: 2,
    link: "#gallery",
    titleGE: "გალერია",
    titleEN: "Gallery",
  },
  {
    id: 3,
    link: "/services",
    titleGE: "სერვისები",
    titleEN: "Services",
  },
  {
    id: 4,
    link: "/contact",
    titleGE: "კონტაქტი",
    titleEN: "Contact",
  },
];

const Navigation = () => {
  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      y: -20,
    },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1 + 0.5,
        duration: 0.6,
        ease: "easeOut",
      },
    }),
    hover: {
      scale: 1.1,
      color: "#87986A",
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
  };

  return (
    <nav className="w-max">
      <motion.ul
        className="hidden md:flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-6"
        initial="hidden"
        animate="visible"
      >
        {navigationItems.map((item, index) => (
          <motion.li
            key={item.id}
            className="list-none"
            variants={itemVariants}
            custom={index}
            whileHover="hover"
          >
            <Link
              href={item.link}
              className="text-white transition-colors duration-200 font-bold relative"
            >
              {item.titleEN}
              <motion.div
                className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#87986A]"
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.3 }}
              />
            </Link>
          </motion.li>
        ))}
      </motion.ul>
    </nav>
  );
};

export default Navigation;
