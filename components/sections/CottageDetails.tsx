"use client";

import { motion, useInView, Variants } from "framer-motion";
import { useRef } from "react";

const CottageDetails = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    margin: "-100px",
  });

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const listItemVariants: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
      },
    },
  };

  const features = [
    {
      category: "Rooms",
      icon: "🛏️",
      items: ["2 Bedrooms", "Kitchen", "Bathroom", "Balcony"],
    },
    {
      category: "Amenities",
      icon: "❄️",
      items: [
        "Air Conditioning",
        "Heating",
        "Mountain View",
        "All Season Access",
      ],
    },
    {
      category: "Nature",
      icon: "🏔️",
      items: [
        "Mountain View",
        "Forest Access",
        "Fresh Air",
        "Peaceful Environment",
      ],
    },
  ];

  return (
    <section
      ref={ref}
      className="w-full py-20 px-5 flex justify-center mt-[100px] relative"
    >
      <div className="bg3 bg-fixed! bg-bottom-left absolute opacity-[0.03] inset-0 bg-cover -z-10"></div>

      <div className="max-w-[1500px] w-full">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="text-center mb-16"
        >
          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold text-gray-800 mb-4"
          >
            Mtiskari Cottage Features
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Experience comfort in nature with all modern amenities
          </motion.p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {features.map((section, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{
                scale: 1.05,
                y: -5,
                transition: { duration: 0.3 },
              }}
              className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl cursor-pointer"
            >
              {/* Header with title left and icons right */}
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
                <h3 className="text-2xl font-semibold text-gray-800">
                  {section.category}
                </h3>
                <div className="flex space-x-2">
                  <motion.span
                    whileHover={{ scale: 1.3, rotate: 5 }}
                    transition={{ duration: 0.2 }}
                    className="text-2xl"
                  >
                    {section.icon}
                  </motion.span>
                </div>
              </div>

              {/* List items */}
              <ul className="space-y-4">
                {section.items.map((item, itemIndex) => (
                  <motion.li
                    key={itemIndex}
                    variants={listItemVariants}
                    whileHover={{ x: 10 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center text-lg text-gray-700"
                  >
                    <motion.span
                      whileHover={{ scale: 1.5 }}
                      className="w-2 h-2 bg-green-500 rounded-full mr-3"
                    ></motion.span>
                    {item}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional Info */}
        {/* Additional Info */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="mt-12"
        >
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            className="bg-linear-to-r from-green-50 to-blue-50 rounded-2xl p-8 text-center"
          >
            <div className="flex justify-center space-x-4 mb-4">
              <motion.span whileHover={{ scale: 1.3 }} className="text-3xl">
                🌄
              </motion.span>
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              Perfect Nature Getaway
            </h3>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              This charming Mtiskari cottage offers the perfect blend of rustic
              charm and modern comfort. Enjoy breathtaking mountain views from
              your balcony, cook meals in the fully-equipped kitchen, and relax
              in the cozy bedrooms after a day of exploring nature.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CottageDetails;
