import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "მთისკარი • Mtiskari",
    short_name: "Mtiskari",
    description:
      "მთისკარი — კომფორტული საოჯახო კოტეჯი დასასვენებლად სოფელ უწერაში, რაჭაში.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#16a34a",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
