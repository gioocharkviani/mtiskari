import React, { ReactNode } from "react";

const ClientLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <div className="flex flex-col items-center justify-center w-full">
      {children}
    </div>
  );
};

export default ClientLayout;
