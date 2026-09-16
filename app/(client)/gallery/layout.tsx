import type { Metadata } from "next";

const SITE_URL = "https://mtiskari.ge";
const TITLE = "Gallery";
const DESCRIPTION =
  "ნახეთ მთისკარის საოჯახო კოტეჯის ფოტოები — ინტერიერი, ბუნება და ხედები სოფელ უწერაში, რაჭაში.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/gallery",
  },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/gallery`,
    title: `${TITLE} • მთისკარი • Mtiskari`,
    description: DESCRIPTION,
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Mtiskari cottage gallery",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${TITLE} • Mtiskari`,
    description: DESCRIPTION,
    images: ["/og-image.jpg"],
  },
};

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
