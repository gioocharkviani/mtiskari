import Link from "next/link";
import React from "react";

const Gallery = () => {
  return (
    <div className="w-full flex justify-center">
      <div className="max-w-[1500px] w-full px-5 pt-36 pb-10">
        <div className="flex w-full flex-col items-center justify-center">
          <span className="font-extrabold text-center text-[42px] w-full leading-12">
            Discover the Beauty of Mtiskari.
          </span>
          <Link href="">See more</Link>
        </div>
        <div className="grid grid-cols-1  md:grid-cols-5 gap-5 mt-6">
          <div className="bg-slate-300 rounded-4xl h-[300px] col-span-3"></div>
          <div className="bg-slate-300 rounded-4xl h-[300px] col-span-2"></div>
          <div className="bg-slate-300 rounded-4xl h-[300px] col-span-2"></div>
          <div className="bg-slate-300 rounded-4xl h-[300px] col-span-3"></div>
        </div>
      </div>
    </div>
  );
};

export default Gallery;
