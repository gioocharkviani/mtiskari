import React from "react";
import Navigation from "./Navigation";

const Header = () => {
  return (
    <div className="w-full flex justify-center px-5 py-[]">
      <div className="max-w-[1500px] h-18 px-2 flex items-center justify-between gap-2.5  w-full">
        <div className="font-bold uppercase text-white text-[30px]">
          Mtiskari
        </div>
        <div>
          <Navigation />
        </div>
      </div>
    </div>
  );
};

export default Header;
