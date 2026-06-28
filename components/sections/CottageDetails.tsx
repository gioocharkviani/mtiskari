"use client";

import { motion, useInView, Variants } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import {
  Bed, Snowflake, Mountain, Wifi, Car, Flame,
  Utensils, Star, Shield, Trees, Sun, Bath,
} from "lucide-react";
import { useContent } from "@/context/ContentContext";

const API = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3001/api/v1";

interface FeatureCard {
  id: number;
  titleEn: string;
  titleKa: string;
  icon: string;
  itemsEn: string[];
  itemsKa: string[];
  isVisible: boolean;
  order: number;
}

function CardIcon({ icon }: { icon: string }) {
  const cls = "w-6 h-6";
  const map: Record<string, React.ReactNode> = {
    bed: <Bed className={cls} />,
    snowflake: <Snowflake className={cls} />,
    mountain: <Mountain className={cls} />,
    wifi: <Wifi className={cls} />,
    car: <Car className={cls} />,
    flame: <Flame className={cls} />,
    utensils: <Utensils className={cls} />,
    star: <Star className={cls} />,
    shield: <Shield className={cls} />,
    trees: <Trees className={cls} />,
    sun: <Sun className={cls} />,
    bath: <Bath className={cls} />,
  };
  return <>{map[icon] ?? <Star className={cls} />}</>;
}

const CottageDetails = () => {
  const ref = useRef(null);
  const { t, lang } = useContent();
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [cards, setCards] = useState<FeatureCard[]>([]);

  useEffect(() => {
    fetch(`${API}/feature-card`)
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setCards(data); })
      .catch(() => {});
  }, []);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.3 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const listItemVariants: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
  };

  const visibleCards = cards.filter((c) => c.isVisible);

  return (
    <section
      id="details"
      ref={ref}
      className="w-full py-20 px-5 flex justify-center mt-[100px] relative"
    >
      <div className="bg3 bg-fixed! bg-bottom-left absolute opacity-[0.03] inset-0 bg-cover -z-10"></div>
      <div className="max-w-[1500px] w-full">
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
            {t("cottage_title", "Mtiskari Cottage Features")}
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            {t("cottage_subtitle", "Experience comfort in nature with all modern amenities")}
          </motion.p>
        </motion.div>

        {visibleCards.length > 0 && (
          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {visibleCards.map((card) => {
              const title = lang === "ka" ? card.titleKa : card.titleEn;
              const items = lang === "ka" ? card.itemsKa : card.itemsEn;
              return (
                <motion.div
                  key={card.id}
                  variants={cardVariants}
                  whileHover={{ scale: 1.05, y: -5, transition: { duration: 0.3 } }}
                  className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl cursor-pointer"
                >
                  <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
                    <h3 className="text-2xl font-semibold text-gray-800">{title}</h3>
                    <div className="flex space-x-2">
                      <motion.span
                        whileHover={{ scale: 1.3, rotate: 5 }}
                        transition={{ duration: 0.2 }}
                        className="text-2xl text-gray-600"
                      >
                        <CardIcon icon={card.icon} />
                      </motion.span>
                    </div>
                  </div>
                  <ul className="space-y-4">
                    {items.map((item, idx) => (
                      <motion.li
                        key={idx}
                        variants={listItemVariants}
                        whileHover={{ x: 10 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center text-lg text-gray-700"
                      >
                        <motion.span
                          whileHover={{ scale: 1.5 }}
                          className="w-2 h-2 bg-green-500 rounded-full mr-3 shrink-0"
                        />
                        {item}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </motion.div>
        )}

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
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              {t("cottage_getaway_title", "Perfect Nature Getaway")}
            </h3>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {t("cottage_desc", "This charming Mtiskari cottage offers the perfect blend of rustic charm and modern comfort. Enjoy breathtaking mountain views from your balcony, cook meals in the fully-equipped kitchen, and relax in the cozy bedrooms after a day of exploring nature.")}
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CottageDetails;
