"use client";

import { motion, Variants } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const Logo = () => {
  const [hasBg, setHasBg] = useState(false);
  const pathName = usePathname();

  useEffect(() => {
    setHasBg(pathName === "/");
  }, [pathName]);

  const logoVariants: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="font-bold uppercase text-[30px]">
      <motion.div
        variants={logoVariants}
        initial="hidden"
        animate="visible"
        className="group cursor-pointer"
      >
        <div className="flex items-center gap-3">
          {/* Logo Text */}
          <div className="flex flex-col">
            <h1
              className={`text-2xl font-bold ${
                hasBg
                  ? "text-white"
                  : "bg-linear-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent"
              }`}
            >
              Mtiskari
            </h1>
            <div
              className={`h-1 w-8 rounded-full mt-0.5 group-hover:w-12 transition-all duration-300 ${
                hasBg
                  ? "bg-linear-to-r from-gray-200 to-gray-300"
                  : "bg-linear-to-r from-green-400 to-emerald-500"
              }`}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Logo;
