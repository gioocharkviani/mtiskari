import BottomNav from "@/components/sections/BottomNav";
import Contact from "@/components/sections/Contact";
import CottageDetails from "@/components/sections/CottageDetails";
import Gallery from "@/components/sections/Gallery";
import Hero from "@/components/sections/Hero";

const API = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3001/api/v1";

async function getSettings(): Promise<Record<string, string>> {
  try {
    const res = await fetch(`${API}/settings`, { cache: "no-store" });
    if (!res.ok) return {};
    return await res.json();
  } catch {
    return {};
  }
}

export default async function Home() {
  const settings = await getSettings();

  const showHero = settings.section_hero !== "false";
  const showRooms = settings.section_rooms !== "false";
  const showGallery = settings.section_gallery !== "false";
  const showContact = settings.section_contact !== "false";

  return (
    <div className="flex flex-col w-full items-center justify-center">
      {showHero && <Hero />}
      {showRooms && <CottageDetails />}
      {showGallery && <Gallery />}
      {showContact && <Contact />}
      <BottomNav />
    </div>
  );
}
