import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.ComponentProps<"input"> {
  variant?: "default" | "ghost";
  inputStart?: React.ReactNode | string;
  inputEnd?: React.ReactNode | string;
}
// $

function Input({
  className,
  inputStart,
  type,
  variant = "default",
  ...props
}: InputProps) {
  return (
    <div className="relative">
      {inputStart && (
        <span className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-sm">
          {inputStart}
        </span>
      )}

      <input
        type={type}
        data-slot="input"
        className={cn(
          inputStart && "ps-6",
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          variant === "default"
            ? "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
            : "border-none shadow-none ring-0",
          className
        )}
        {...props}
      />
    </div>
  );
}

export { Input };
