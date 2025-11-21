import Image from "next/image";
import Link from "next/link";
import React from "react";
import test1 from "../../public/test/1.jpg";
import test2 from "../../public/test/2.jpg";
import test3 from "../../public/test/3.jpg";
import test4 from "../../public/test/4.jpg";

const images = [
  {
    id: 1,
    src: test1,
    alt: "Mtiskari landscape 1",
    colSpan: "md:col-span-3",
  },
  {
    id: 2,
    src: test2,
    alt: "Mtiskari landscape 2",
    colSpan: "md:col-span-2",
  },
  {
    id: 3,
    src: test3,
    alt: "Mtiskari landscape 3",
    colSpan: "md:col-span-2",
  },
  {
    id: 4,
    src: test4,
    alt: "Mtiskari landscape 4",
    colSpan: "md:col-span-3",
  },
];

const Gallery = () => {
  return (
    <div className="w-full flex justify-center">
      <div className="max-w-[1500px] w-full px-5 pt-36 pb-10">
        <div className="flex w-full flex-col gap-3 items-center justify-center">
          <span className="font-extrabold text-center text-[42px] w-full leading-12">
            Discover the Beauty of Mtiskari
          </span>
          <Link
            href=""
            className="text-[#005e06] px-4 py-2 rounded-2xl bg-[#cdefcd] font-bold text-[16px] hover:bg-[#b8e0b8] transition-colors duration-300"
          >
            See more
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-5 mt-6">
          {images.map((i) => (
            <div
              key={i.id}
              className={`relative overflow-hidden rounded-4xl h-[300px] ${i.colSpan} group`}
            >
              <Image
                src={i.src}
                alt="Mtiskari landscape"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                placeholder="blur"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 60vw"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Gallery;
