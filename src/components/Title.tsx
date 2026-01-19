import { cx } from "@/utils/cx";
import type { ElementType, ReactNode } from "react";

interface TitleProps {
  className?: string;
  children: ReactNode;
  level: 1 | 2 | 3 | 4 | 5 | 6;
  as?: ElementType;
}

const TITLE_LEVEL_CLASS = {
  6: "text-lg",
  5: "text-xl",
  4: "text-2xl",
  3: "text-3xl",
  2: "text-4xl",
  1: "text-5xl",
} as const;

export const Title = ({
  children,
  level = 1,
  className,
  as: Component = "div",
}: TitleProps) => {
  return (
    <Component className={cx(TITLE_LEVEL_CLASS[level], "font-bold", className)}>
      {children}
    </Component>
  );
};
