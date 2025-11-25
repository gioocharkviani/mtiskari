"use client";
import ComfortCard from "../cards/ComfortCard";
import { ComfortTypes } from "@/types";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useState } from "react";

//accets
import route from "../../public/services/1/route.png";
import firePlace from "../../public/services/1/firePlase.png";
import hicking from "../../public/services/1/hicking.png";
import forest from "../../public/services/1/forest.png";
import boat from "../../public/services/1/boat.png";

const dummy: ComfortTypes[] = [
  {
    id: 1,
    icon: firePlace,
    titleEn: "Cozy Camp Nights",
    titleGe: "მყუდრო ბანაკის ღამეები",
    descEn:
      "Experience enchanting evenings curled up by our stone fireplace, where the flickering light creates an intimate and romantic ambiance.",
    descGe:
      "განიჭეთ უმაღლესი კომფორტი ჩვენს ლამაზად დაპროექტებულ ოთახებში პრემიუმი ხელმისაწვდომობებით და გარშემორტყმული ბუნების გასაოცარი ხედებით.",
  },
  {
    id: 2,
    icon: hicking,
    titleEn: "Peak Exploration",
    titleGe: "მწვერვალების დალაშქვრა",
    descEn:
      "Scale breathtaking summits with guided tours that offer stunning vistas and a true connection with nature's majesty.",
    descGe:
      "დაისვენეთ და განაახლეთ თავი ჩვენი ექსკლუზიური სპა პროცედურებით, საუნით და ჯანმრთელობის პროგრამებით, რომლებიც შექმნილია თქვენი გონების და სხეულის გასაახლებლად.",
  },
  {
    id: 3,
    icon: forest,
    titleEn: "Deep Forest Treks",
    titleGe: "ღრმა ტყის ბილიკები",
    descEn:
      "Wander through dense woods and hidden trails, immersing yourself in the tranquil, untouched beauty of the forest canopy.",
    descGe:
      "დააგემოვნეთ ნახევრად ადგილობრივი და საერთაშორისო კულინარია, რომელიც მომზადებულია ჩვენი ექსპერტი შეფ-მზარეულების მიერ ადგილობრივი ახალი ინგრედიენტების გამოყენებით.",
  },
  {
    id: 4,
    icon: boat,
    titleEn: "River Relaxation",
    titleGe: "მდინარის სიმშვიდე",
    descEn:
      "While we do not provide equipment, guests are welcome to bring their own gear to enjoy the gentle currents and natural beauty of the Rioni river.",
    descGe:
      "აქტივობებისთვის აღჭურვილობას არ გთავაზობთ, თუმცა, სტუმრებს შეუძლიათ საკუთარი ინვენტარის გამოყენებით ისიამოვნონ რიონის მდინარის ნაზი დინებითა და ბუნების სილამაზით.",
  },
  {
    id: 5,
    icon: route,
    titleEn: "The Quest Begins",
    titleGe: "თავგადასავლის დაწყება",
    descEn:
      "Uncover hidden secrets and follow ancient routes with our curated maps, leading you to your next grand discovery.",
    descGe:
      "გამოიყენეთ ჩვენი რუკები, რათა აღმოაჩინოთ ფარული საიდუმლოებები და გაუყვეთ უძველეს მარშრუტებს თქვენი შემდეგი დიდი თავგადასავლისკენ.",
  },
  {
    id: 6,
    icon: boat,
    titleEn: "Mineral Water Springs",
    titleGe: "მინერალური წყაროები",
    descEn:
      "Discover the famed Utsera mineral waters, known for their healing properties, and experience a refreshing, natural therapy unique to the Racha region.",
    descGe:
      "აღმოაჩინეთ უწერას ცნობილი მინერალური წყლები, რომლებიც განთქმულია სამკურნალო თვისებებით. დატკბით ბუნებრივი, გამაჯანსაღებელი თერაპიით, რომელიც მხოლოდ რაჭის რეგიონისთვისაა დამახასიათებელი.",
  },
  {
    id: 7, // NEW: Fishing
    icon: boat,
    titleEn: "Rioni River Fishing",
    titleGe: "თევზაობა რიონზე", // Fishing on Rioni
    descEn:
      "Enjoy fly or spin fishing in the majestic Rioni river, known for its abundant trout. Bring your own gear and try your luck in Georgias prime fishing spot.",
    descGe:
      "ისიამოვნეთ ფლაი ან სპინინგ თევზაობით დიდებულ რიონზე, სადაც გავრცელებულია კალმახი. მოიტანეთ საკუთარი აღჭურვილობა და გამოსცადეთ თქვენი ბედი საქართველოს საუკეთესო სათევზაო ადგილას.",
  },
  {
    id: 8, // NEW: Culture/History
    icon: boat,
    titleEn: "Utsera's Heritage",
    titleGe: "უწერას მემკვიდრეობა",
    descEn:
      "Explore Utseras history as a popular tourist village and spa resort, learning about the local traditions and the unique culture of the Racha region.",
    descGe:
      "გაეცანით უწერას ისტორიას, როგორც პოპულარულ ტურისტულ სოფელს და სპა კურორტს. შეიტყვეთ ადგილობრივი ტრადიციებისა და რაჭის რეგიონის უნიკალური კულტურის შესახებ.",
  },
];

const Activites = () => {
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
    <section className="w-full flex justify-center relative px-5">
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
                  className="text-[#041f06] px-4 py-2 rounded-2xl bg-[#cdefcd] font-bold text-[16px] hover:bg-[#b8e0b8] transition-colors duration-300 block"
                >
                  {showAll ? "Show Less" : "See More Comforts"}
                </motion.button>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default Activites;
