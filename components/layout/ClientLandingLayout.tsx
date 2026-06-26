"use client";
import React, { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { ContentProvider } from "@/context/ContentContext";

const ClientLandingLayout = ({
  children,
}: Readonly<{ children: ReactNode }>) => {
  return (
    <ContentProvider>
      <div className="flex flex-col items-center relative justify-center w-full">
        <Header />
        {children}
        <Footer />
      </div>
    </ContentProvider>
  );
};

export default ClientLandingLayout;
