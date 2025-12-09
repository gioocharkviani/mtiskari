"use client";
import { usePathname } from "next/navigation";
import Navigation from "./Navigation";
import { useRef } from "react";
import { motion, Variants } from "framer-motion";

const Header = () => {
  const pathname = usePathname();
  const replacedPathname = pathname.replace("/", "");

  const hasBg = () => {
    if (replacedPathname === "") {
      return true;
    }
    return false;
  };

  const ref = useRef<HTMLDivElement>(null);

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
    <motion.div
      ref={ref}
      initial="hidden"
      animate="visible"
      className="absolute top-2 w-full z-10"
    >
      <div className="w-full flex justify-center px-5 ">
        <motion.div
          animate={{
            backgroundColor: hasBg()
              ? "rgba(255, 255, 255, 0)"
              : "rgba(255, 255, 255, 0.98)",

            backdropFilter: hasBg() ? "blur(0px)" : "blur(10px)",
            boxShadow: hasBg()
              ? "none"
              : "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
            border: hasBg()
              ? "1px solid transparent"
              : "1px solid rgba(229, 231, 235, 0.3)",
          }}
          transition={{ duration: 0.3 }}
          className={` rounded-2xl max-w-[1500px] w-full h-16 px-6 flex items-center justify-between shadow-sm`}
        >
          <div className="font-bold uppercase text-white text-[30px]">
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
                    className={`text-2xl font-bold bg-linear-to-r ${hasBg() ? "from-green-600 to-emerald-700" : "from-green-500 to-emerald-600"} bg-clip-text text-transparent`}
                  >
                    Mtiskari
                  </h1>
                  <div className="h-1 w-8 bg-linear-to-r from-green-400 to-emerald-500 rounded-full mt-0.5 group-hover:w-12 transition-all duration-300" />
                </div>
              </div>
            </motion.div>
          </div>
          <div>
            <Navigation />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Header;
