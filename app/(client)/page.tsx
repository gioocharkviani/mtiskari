import Comfort from "@/components/sections/Comfort";

import Gallery from "@/components/sections/Gallery";
import Hero from "@/components/sections/Hero";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col w-full items-center justify-center">
      <Hero />
      <Gallery />
      <Comfort />
    </div>
  );
}
