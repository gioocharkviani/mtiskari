"use client";
import { motion, Variants } from "framer-motion";

const Logo = () => {
  const hasBg = false;
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
              className={`text-2xl font-bold bg-linear-to-r ${hasBg ? "from-green-600 to-emerald-700" : "from-green-500 to-emerald-600"} bg-clip-text text-transparent`}
            >
              Mtiskari
            </h1>
            <div className="h-1 w-8 bg-linear-to-r from-green-400 to-emerald-500 rounded-full mt-0.5 group-hover:w-12 transition-all duration-300"></div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Logo;
