"use client";
import ComfortCard from "../cards/ComfortCard";
import image1 from "../../public/services/1/Adventure-Icon-10.png";
import { ComfortTypes } from "@/types";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useState } from "react";

const dummy: ComfortTypes[] = [
  {
    id: 1,
    icon: image1,
    titleEn: "Luxury Accommodation",
    titleGe: "ლუქსუსი განთავსება",
    descEn:
      "Experience ultimate comfort in our beautifully designed rooms with premium amenities and stunning views of the surrounding nature.",
    descGe:
      "განიჭეთ უმაღლესი კომფორტი ჩვენს ლამაზად დაპროექტებულ ოთახებში პრემიუმი ხელმისაწვდომობებით და გარშემორტყმული ბუნების გასაოცარი ხედებით.",
  },
  {
    id: 2,
    icon: image1,
    titleEn: "Spa & Wellness",
    titleGe: "სპა და ჯანმრთელობა",
    descEn:
      "Relax and rejuvenate with our exclusive spa treatments, sauna, and wellness programs designed to refresh your mind and body.",
    descGe:
      "დაისვენეთ და განაახლეთ თავი ჩვენი ექსკლუზიური სპა პროცედურებით, საუნით და ჯანმრთელობის პროგრამებით, რომლებიც შექმნილია თქვენი გონების და სხეულის გასაახლებლად.",
  },
  {
    id: 3,
    icon: image1,
    titleEn: "Gourmet Dining",
    titleGe: "გურმანული კვება",
    descEn:
      "Savor exquisite local and international cuisine prepared by our expert chefs using fresh, locally sourced ingredients.",
    descGe:
      "დააგემოვნეთ ნახევრად ადგილობრივი და საერთაშორისო კულინარია, რომელიც მომზადებულია ჩვენი ექსპერტი შეფ-მზარეულების მიერ ადგილობრივი ახალი ინგრედიენტების გამოყენებით.",
  },
  {
    id: 4,
    icon: image1,
    titleEn: "Adventure Activities",
    titleGe: "სათავგადასავლო აქტივობები",
    descEn:
      "Explore the great outdoors with guided hiking, mountain biking, and nature walks through our breathtaking landscapes.",
    descGe:
      "გაეცანით დიდ ღია ცის ქვეშ მდებარე ადგილებს ჰაიკინგით, მთის ველოსიპედით და ბუნების ფეხით სეირნობით ჩვენი გასაოცარი ლანდშაფტების მეშვეობით.",
  },
  {
    id: 5,
    icon: image1,
    titleEn: "Swimming Pool",
    titleGe: "საცურაო აუზი",
    descEn:
      "Enjoy our infinity pool overlooking the mountains, perfect for a refreshing swim or relaxing by the water with a cocktail.",
    descGe:
      "ისიამოვნეთ ჩვენი უსასრულო აუზით, რომელიც მთებს უყურებს, სრულყოფილია გამაგრილებელი ცურვისთვის ან კოქტეილით წყლის გასწვრივ დასასვენებლად.",
  },
  {
    id: 6,
    icon: image1,
    titleEn: "Conference Facilities",
    titleGe: "კონფერენციის ობიექტები",
    descEn:
      "Host successful business meetings and events in our fully equipped conference rooms with modern technology and professional service.",
    descGe:
      "გამართეთ წარმატებული ბიზნეს შეხვედრები და ღონისძიებები ჩვენს სრულად აღჭურვილ კონფერენციის ოთახებში თანამედროვე ტექნოლოგიებით და პროფესიონალური სერვისით.",
  },
  {
    id: 7,
    icon: image1,
    titleEn: "Fitness Center",
    titleGe: "ფიტნეს ცენტრი",
    descEn:
      "Stay active during your stay with our state-of-the-art fitness equipment, yoga classes, and personal training sessions.",
    descGe:
      "დარჩით აქტიური თქვენი ვიზიტის დროს ჩვენი თანამედროვე ფიტნეს აღჭურვილობით, იოგის გაკვეთილებით და პერსონალური ვარჯიშის სესიებით.",
  },
  {
    id: 8,
    icon: image1,
    titleEn: "Kids Club",
    titleGe: "ბავშვთა კლუბი",
    descEn:
      "Children enjoy supervised activities, games, and entertainment while parents relax and enjoy their vacation time.",
    descGe:
      "ბავშვები უვარგიშებენ ზედამხედველობის ქვეშ არსებულ აქტივობებს, თამაშებს და გართობას, ხოლო მშობლები ისვენებენ და უვარგიშებენ თავიანთ შვებულების დროს.",
  },
];

const Comfort = () => {
  const [showAll, setShowAll] = useState(false);
  const visibleItems = showAll ? dummy : dummy.slice(0, 4);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      y: -50,
      scale: 0.9,
      transition: {
        duration: 0.4,
      },
    },
  };

  const titleVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 30,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const buttonVariants: Variants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        delay: 0.3,
      },
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
      },
    },
    tap: {
      scale: 0.95,
    },
  };

  return (
    <div className="w-full flex justify-center relative px-5">
      <div className="bg2  opacity-[0.08] bg-fixed! bg-bottom-left absolute inset-0 bg-cover -z-10"></div>
      <div className="w-full pb-5 max-w-[1500px] flex flex-col mt-20 min-h-screen xl:min-h-max">
        <motion.div
          className="flex w-full justify-center items-center flex-col"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <motion.span
            variants={titleVariants}
            className="text-5xl font-extrabold text-center mb-8"
          >
            Stay Amidst Comfort and Nature
          </motion.span>

          <motion.div
            className="grid max-w-max grid-cols-1 md:grid-cols-2 my-14 gap-6 justify-items-center"
            layout
          >
            <AnimatePresence>
              {visibleItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  whileHover={{
                    y: -5,
                    transition: { duration: 0.3 },
                  }}
                  custom={index}
                >
                  <ComfortCard data={item} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {dummy.length > 4 && (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={buttonVariants}
              className="flex justify-center mt-4"
            >
              {dummy.length > 4 && (
                <motion.button
                  onClick={() => setShowAll(!showAll)}
                  whileHover="hover"
                  whileTap="tap"
                  variants={buttonVariants}
                  className="text-[#005e06] px-4 py-2 rounded-2xl bg-[#cdefcd] font-bold text-[16px] hover:bg-[#b8e0b8] transition-colors duration-300 block"
                >
                  {showAll ? "Show Less" : "See More Comforts"}
                </motion.button>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Comfort;
