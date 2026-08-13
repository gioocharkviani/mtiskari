import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "გალერეა",
  description: "დაათვალიერეთ მთისკარის კოტეჯებისა და ტერიტორიის ფოტოგალერეა.",
  alternates: {
    canonical: "/gallery",
  },
  openGraph: {
    title: "გალერეა • მთისკარი",
    description: "დაათვალიერეთ მთისკარის კოტეჯებისა და ტერიტორიის ფოტოგალერეა.",
    url: "/gallery",
  },
};

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
