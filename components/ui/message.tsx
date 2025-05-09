import { cn } from "@/lib/utils";

export type Message = {
  from: "user" | "assistant";
  text: string;
};

export const Message = ({
  from = "user",
  children,
  className,
  ...props
}: React.ComponentProps<"p"> & { from: "assistant" | "user" }) => {
  return (
    <p
      className={cn(
        "max-w-prose rounded-lg p-2 text-xs leading-4.5",
        from === "user" ? "bg-secondary/20" : "bg-gray-200",
        className,
      )}
      {...props}
    >
      {children}
    </p>
  );
};
