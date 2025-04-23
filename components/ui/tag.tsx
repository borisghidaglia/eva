import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";
import { ComponentProps } from "react";

export const Tag = ({
  asChild = false,
  className,
  children,
  ref,
  ...props
}: ComponentProps<typeof Slot> & {
  asChild?: boolean;
  className?: string;
}) => {
  const Comp = asChild ? Slot : "span";
  return (
    <Comp
      ref={ref}
      className={cn(
        "bg-secondary/20 rounded-full px-2 py-1 text-xs text-nowrap",
        className,
      )}
      {...props}
    >
      {children}
    </Comp>
  );
};
