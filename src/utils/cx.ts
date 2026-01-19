import { clsx } from "clsx";
import { twMerge, type ClassNameValue } from "tailwind-merge";

export const cx = (...classes: ClassNameValue[]) => {
  return clsx(twMerge(classes));
};
