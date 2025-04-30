import { cn } from "@/lib/utils";

export type Message = {
  from: "user" | "assistant";
  text: string;
};

export const Message = ({
  from = "user",
  children,
  ...props
}: React.ComponentProps<"p"> & { from: "assistant" | "user" }) => {
  return (
    <p
      className={cn(
        "max-w-prose rounded-lg p-2 text-xs",
        from === "user" ? "bg-secondary/20 self-end" : "self-start bg-gray-200",
      )}
      {...props}
    >
      {children}
    </p>
  );
};
