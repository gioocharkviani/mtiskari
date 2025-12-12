"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export const useHasBg = () => {
  const [hasBg, setHasBg] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setHasBg(pathname === "/");
  }, [pathname]);

  return hasBg;
};
