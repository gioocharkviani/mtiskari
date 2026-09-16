import type { Metadata } from "next";

const SITE_URL = "https://mtiskari.ge";
const TITLE = "Availability Calendar";
const DESCRIPTION =
  "შეამოწმეთ მთისკარის კოტეჯების ხელმისაწვდომობა და დაჯავშნეთ თქვენი დასვენება უწერაში, რაჭაში.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/calendar",
  },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/calendar`,
    title: `${TITLE} • მთისკარი • Mtiskari`,
    description: DESCRIPTION,
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Mtiskari cottage availability calendar",
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

export default function CalendarLayout({ children }: { children: React.ReactNode }) {
  return children;
}
