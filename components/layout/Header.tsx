"use client";
import Navigation from "./Navigation";
import { useRef } from "react";
import { motion } from "framer-motion";
import Logo from "./Logo";

const Header = () => {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate="visible"
      className="absolute top-0 left-0 w-full z-10"
    >
      <div className="w-full flex justify-center ">
        <motion.div
          transition={{ duration: 0.3 }}
          className={` max-w-[1500px] w-full h-16 px-6 md:mt-2 flex items-center justify-between `}
        >
          <Logo />
          <Navigation />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Header;
