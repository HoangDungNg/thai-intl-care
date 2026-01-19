import { cx } from "@/utils/cx";
import type { ElementType, ReactNode } from "react";

interface TextProps {
  className?: string;
  children: ReactNode;
  as?: ElementType;
}

export const Text = ({
  children,
  className,
  as: Component = "div",
}: TextProps) => {
  return (
    <Component className={cx("text-base font-light", className)}>
      {children}
    </Component>
  );
};
