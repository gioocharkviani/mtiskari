"use client";
import React from "react";
import { motion, Variants } from "framer-motion";

const HeroBooking = () => {
  const bookingVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 100,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      y: 50,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        delay: 0.3,
      },
    },
  };

  return (
    <motion.div
      className="w-full max-w-[1500px] border-[3px] bg-white backdrop-blur-md rounded-2xl p-6 shadow-lg"
      initial="hidden"
      animate="visible"
      whileHover="hover"
      variants={bookingVariants}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-center"
      >
        {/* <h3 className="text-xl font-bold text-gray-800 mb-4">Book Your Stay</h3> */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.input
            whileFocus={{ scale: 1.05 }}
            type="date"
            placeholder="Check-in"
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#87986A]"
          />
          <motion.input
            whileFocus={{ scale: 1.05 }}
            type="date"
            placeholder="Check-out"
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#87986A]"
          />
          <motion.select
            whileFocus={{ scale: 1.05 }}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#87986A]"
          >
            <option>1 Guest</option>
            <option>2 Guests</option>
            <option>3+ Guests</option>
          </motion.select>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#87986A] text-white p-3 rounded-lg font-semibold hover:bg-[#6b7a52] transition-colors duration-300"
          >
            Check Availability
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default HeroBooking;
