import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "დაჯავშნა",
  description: "შეამოწმეთ ხელმისაწვდომობა და დაჯავშნეთ მთისკარის კოტეჯი კალენდარში.",
  alternates: {
    canonical: "/calendar",
  },
  openGraph: {
    title: "დაჯავშნა • მთისკარი",
    description: "შეამოწმეთ ხელმისაწვდომობა და დაჯავშნეთ მთისკარის კოტეჯი კალენდარში.",
    url: "/calendar",
  },
};

export default function CalendarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
