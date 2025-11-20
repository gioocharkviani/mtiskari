import { StaticImageData } from "next/image";

export interface ComfortTypes {
  id: number;
  icon: HTMLImageElement | string | StaticImageData;
  titleGe?: string;
  titleEn?: string;
  descGe?: string;
  descEn?: string;
}
