import React, { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";

const ClientLandingLayout = ({
  children,
}: Readonly<{ children: ReactNode }>) => {
  return (
    <div className="flex flex-col items-center relative justify-center w-full">
      <Header />
      {children}
      <Footer />
    </div>
  );
};

export default ClientLandingLayout;
