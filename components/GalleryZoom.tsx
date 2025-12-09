"use client";

import { useState } from "react";

interface PropsInterface {
  isOpen?: boolean;
}

export const GalleryZoom = ({ isOpen }: PropsInterface) => {
  const [open, setOpen] = useState(isOpen || false);
  return (
    <>
      {open && (
        <div
          className="z-999999 w-screen h-screen fixed top-0 p-5 "
          onClick={() => setOpen(false)}
        >
          <div className="rounded-3xl bg-[rgba(0,0,0,0.7)] w-full h-full"></div>
        </div>
      )}
    </>
  );
};
