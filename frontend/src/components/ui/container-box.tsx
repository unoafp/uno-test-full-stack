import { cn } from "@/lib/utils";
import { type ClassValue } from "clsx";
import React from "react";

const ContainerBox: React.FC<{
  className?: ClassValue;
  children: React.ReactNode;
}> = ({ className, children }) => {
  return (
    <div className={cn("container mx-auto px-4", className)}>{children}</div>
  );
};

export default ContainerBox;
