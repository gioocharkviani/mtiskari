import type { Metadata } from "next";
import "../globals.css";
import ClientLandingLayout from "@/components/layout/ClientLandingLayout";

export const metadata: Metadata = {
  title: "მთისკარი • Mtiskari",
  description: "მთისკარი კოტეჯი უწერაში",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <ClientLandingLayout>{children}</ClientLandingLayout>
      </body>
    </html>
  );
}
