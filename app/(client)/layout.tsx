import type { Metadata } from "next";
import "../globals.css";
import ClientLandingLayout from "@/components/layout/ClientLandingLayout";

const SITE_URL = "https://mtiskari.ge";
const SITE_NAME = "მთისკარი • Mtiskari";
const DESCRIPTION =
  "მთისკარი — კომფორტული საოჯახო კოტეჯები დასასვენებლად. დაჯავშნეთ თქვენი დასვენება ბუნებაში, საუკეთესო სერვისითა და ხედებით.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s • ${SITE_NAME}`,
  },
  description: DESCRIPTION,
  keywords: [
    "მთისკარი",
    "mtiskari",
    "კოტეჯები",
    "დასვენება",
    "cottages georgia",
    "საოჯახო კოტეჯი",
  ],
  authors: [{ name: "Mtiskari" }],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    locale: "ka_GE",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: DESCRIPTION,
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: DESCRIPTION,
    images: ["/og.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  name: "Mtiskari",
  image: `${SITE_URL}/og.png`,
  url: SITE_URL,
  description: DESCRIPTION,
  address: {
    "@type": "PostalAddress",
    addressCountry: "GE",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ka">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body suppressHydrationWarning={true}>
        <ClientLandingLayout>{children}</ClientLandingLayout>
      </body>
    </html>
  );
}
