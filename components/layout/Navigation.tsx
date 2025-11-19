import Link from "next/link";
import React from "react";

interface NavigationItem {
  id: number;
  link: string;
  titleGE: string;
  titleEN: string;
}

const navigationItems: NavigationItem[] = [
  {
    id: 1,
    link: "/",
    titleGE: "მთავარი",
    titleEN: "Home",
  },
  {
    id: 2,
    link: "/Gallery",
    titleGE: "გალერია",
    titleEN: "Gallery",
  },
  {
    id: 3,
    link: "/services",
    titleGE: "სერვისები",
    titleEN: "Services",
  },
  {
    id: 4,
    link: "/contact",
    titleGE: "კონტაქტი",
    titleEN: "Contact",
  },
];

const Navigation = () => {
  return (
    <nav className="w-max">
      <ul className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-6">
        {navigationItems.map((item) => (
          <li key={item.id} className="list-none">
            <Link
              href={item.link}
              className="text-white  transition-colors duration-200 font-bold"
            >
              {item.titleEN}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;
