import BottomNav from "@/components/sections/BottomNav";
import Contact from "@/components/sections/Contact";
import CottageDetails from "@/components/sections/CottageDetails";

import Gallery from "@/components/sections/Gallery";
import Hero from "@/components/sections/Hero";

export default async function Home() {
  //getAllCalendarData

  return (
    <div className="flex flex-col w-full items-center justify-center">
      <Hero />
      <CottageDetails />
      <Gallery />

      <Contact />
      <BottomNav />
    </div>
  );
}
