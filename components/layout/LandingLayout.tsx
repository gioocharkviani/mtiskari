import React, { ReactNode } from "react";
import Footer from "./Footer";

const LandingLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <div className="flex flex-col items-center relative justify-center w-full">
      {children}
      <Footer />
    </div>
  );
};

export default LandingLayout;
