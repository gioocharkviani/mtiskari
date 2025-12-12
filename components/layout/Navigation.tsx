"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, Variants, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

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
    id: 14,
    link: "/#details",
    titleGE: "დეტალები",
    titleEN: "Details",
  },
  {
    id: 2,
    link: "gallery",
    titleGE: "გალერია",
    titleEN: "Gallery",
  },
  {
    id: 3,
    link: "/#activites",
    titleGE: "აქტივობები",
    titleEN: "Activites",
  },
  {
    id: 4,
    link: "/#contact",
    titleGE: "კონტაქტი",
    titleEN: "Contact",
  },
];

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hasBg, setHasBg] = useState(false);
  const pathName = usePathname();

  useEffect(() => {
    setHasBg(pathName === "/");
  }, [pathName]);
  const textColor = hasBg ? "white" : "black";

  //remove scroll
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      document.documentElement.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      document.documentElement.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);
  //remove scroll

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

  const mobileMenuVariants: Variants = {
    closed: {
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
    open: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  const mobileItemVariants: Variants = {
    closed: {
      opacity: 0,
      x: -20,
    },
    open: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.4,
        ease: "easeOut",
      },
    }),
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="w-max relative">
      {/* Desktop Navigation */}
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
              style={{ color: textColor }}
              className={`transition-colors duration-200 font-bold relative`}
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

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <motion.button
          className="relative z-50 w-8 h-8 flex flex-col justify-center items-center"
          onClick={toggleMobileMenu}
          whileTap={{ scale: 0.95 }}
        >
          <motion.span
            style={{ background: textColor }}
            className="w-6 h-0.5 block absolute"
            animate={
              isMobileMenuOpen ? { rotate: 45, y: 0 } : { rotate: 0, y: -6 }
            }
            transition={{ duration: 0.3 }}
          />
          <motion.span
            style={{ background: textColor }}
            className="w-6 h-0.5 block"
            animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
          <motion.span
            style={{ background: textColor }}
            className="w-6 h-0.5  block absolute"
            animate={
              isMobileMenuOpen ? { rotate: -45, y: 0 } : { rotate: 0, y: 6 }
            }
            transition={{ duration: 0.3 }}
          />
        </motion.button>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <div className="fixed w-full min-h-screen h-full flex flex-row-reverse inset-0 top-0 left-0 z-9999999999999999999999">
              <motion.div
                className="w-full h-full bg-[rgba(0,0,0,0.5)] shadow-xl"
                variants={mobileMenuVariants}
                initial="closed"
                animate="open"
                exit="closed"
              />
              <motion.div
                className="w-full h-full bg-[#111624] shadow-xl"
                variants={mobileMenuVariants}
                initial="closed"
                animate="open"
                exit="closed"
              >
                <div className="pt-20 px-6">
                  <motion.ul className="flex flex-col space-y-6">
                    {navigationItems.map((item, index) => (
                      <motion.li
                        key={item.id}
                        className="list-none"
                        variants={mobileItemVariants}
                        custom={index}
                        initial="closed"
                        animate="open"
                        whileHover={{ x: 10 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Link
                          href={item.link}
                          className="text-white text-lg font-semibold transition-colors duration-200 hover:text-[#87986A] block py-2"
                          onClick={closeMobileMenu}
                        >
                          {item.titleEN}
                        </Link>
                      </motion.li>
                    ))}
                  </motion.ul>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
        {/* end Mobile Nav */}
      </div>
    </nav>
  );
};

export default Navigation;
