"use client";
import React, { useState } from "react";
import { motion, Variants } from "framer-motion";
import { Calendar, DollarSign } from "lucide-react";

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
      {/* Modal */}
      {openDateRange && (
        <motion.div
          className="w-screen h-screen fixed top-0 left-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute w-full h-full bg-[rgba(0,0,0,0.5)]"
            onClick={() => setOpenDateRange(false)}
          />
          <motion.div
            className="relative bg-white rounded-lg p-6 max-w-md w-full mx-4"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Select Date Range</h2>
              <button
                onClick={() => setOpenDateRange(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="p-4 border border-gray-200 rounded"></div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setOpenDateRange(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => setOpenDateRange(false)}
                className="px-4 py-2 bg-[#87986A] text-white rounded-lg hover:bg-[#718559]"
              >
                Apply
              </button>
            </div>
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
