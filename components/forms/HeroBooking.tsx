"use client";
import React, { useState } from "react";
import { motion, Variants } from "framer-motion";
import { Calendar, DollarSign, X } from "lucide-react";
import DateRangeComp from "../DateRangeComp";

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

  const [openDateRange, setOpenDateRange] = useState(false);

  return (
    <>
      {/* Modal - Fixed for all screen sizes */}
      {openDateRange && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpenDateRange(false)}
        >
          <motion.div
            className="relative w-max h-max max-w-[95vw] max-h-[95vh] bg-white rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            initial={{ y: 20, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}

            {/* Modal Content - Responsive */}
            <div className="flex-1 overflow-auto">
              <div className="w-full">
                <DateRangeComp />
              </div>
            </div>

            {/* Modal Footer */}
          </motion.div>
        </motion.div>
      )}

      <motion.div
        className="w-full max-w-[1500px] border-[3px] bg-white backdrop-blur-md rounded-2xl p-6 shadow-lg"
        initial="hidden"
        animate="visible"
        variants={bookingVariants}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center"
        >
          <div className="w-full justify-between flex md:flex-row flex-col gap-4">
            {/* DATA PICKER INPUT */}

            <div
              className="w-full cursor-pointer"
              onClick={() => setOpenDateRange(true)}
            >
              <div className="p-2 border-2 w-full border-gray-200 rounded-lg bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Calendar className="w-5 h-5 text-[#027a02]" />
                  </div>
                  <div className="text-left flex flex-col items-start ">
                    <div className="flex gap-2 justify-start">
                      <p className="text-sm text-gray-500">check-in:</p>
                      <p className="text-sm font-medium text-gray-800">
                        YYYY-MM-DD
                      </p>
                    </div>
                    <div className="flex gap-2 justify-start">
                      <p className="text-sm text-gray-500">check-out:</p>
                      <p className="text-sm font-medium text-gray-800">
                        YYYY-MM-DD
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* GUEST COUNT */}
            <motion.input
              whileFocus={{ scale: 1.05 }}
              placeholder="guest count"
              className="p-2 border-2 w-full border-gray-200 rounded-lg bg-gray-50"
            />

            {/* TOTAL COST */}
            <div className="w-full">
              <div className="p-2 border-2 w-full border-gray-200 rounded-lg bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <DollarSign className="w-5 h-5 text-[#027a02]" />
                  </div>
                  <div className="text-left flex gap-4 items-center">
                    <p className="text-sm text-gray-500">Total Cost</p>
                    <p className="font-bold text-xl text-gray-800">0</p>
                  </div>
                </div>
              </div>
            </div>
            {/* BOOK NOW */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#cdefcd] w-full text-[#000000] p-3 rounded-lg font-semibold hover:bg-[#b8e0b8] transition-colors duration-300"
            >
              book now
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
};

export default HeroBooking;
