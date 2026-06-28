"use client";

import HeroBooking from "../forms/HeroBooking";
import { motion, Variants } from "framer-motion";
import { useContent } from "@/context/ContentContext";

const Hero = () => {
  const { t } = useContent();

  const backgroundVariants: Variants = {
    hidden: { scale: 1.1, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 1, ease: "easeOut" },
    },
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1, delay: 0.5 } },
  };

  return (
    <section
      id="hero"
      className="w-full flex justify-center min-h-screen relative"
    >
      <motion.div
        className="w-full h-full absolute hero-bg bg-position-[calc(100%+0px)_center]! bg-cover! md:bg-center! z-1"
        variants={backgroundVariants}
        initial="hidden"
        animate="visible"
      />
      <motion.div
        className="hero-bg-overlay absolute z-2"
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
      />

      <motion.div
        className="w-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-3 px-5 text-center"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.8 }}
      >
        <motion.h1
          className="text-5xl md:text-7xl font-bold text-white mb-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          {t("hero_title", "Welcome to Mtiskari")}
        </motion.h1>
        <motion.p
          className="text-xl md:text-2xl text-white mb-8 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          {t("hero_subtitle", "Experience luxury amidst nature's beauty")}
        </motion.p>
      </motion.div>

      <div className="w-full absolute bottom-0 flex justify-center z-20 px-5">
        <HeroBooking />
      </div>
    </section>
  );
};

export default Hero;
