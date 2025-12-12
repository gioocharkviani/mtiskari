import { usePathname } from "next/navigation";

const useHasBg = (): boolean => {
  const pathname = usePathname();

  return pathname === "/";
};

export default useHasBg;
