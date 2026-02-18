import React, { ComponentProps, forwardRef } from "react";
import { Input } from "../ui/Input";
import { formatRut } from "@/shared/rut/format-rut";

type RutInputProps = ComponentProps<typeof Input>;

export const RutInput = forwardRef<HTMLInputElement, RutInputProps>(
  ({ onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const formatted = formatRut(e.target.value);

      // mutate value before passing up
      e.target.value = formatted;

      onChange?.(e);
    };

    return (
      <Input
        {...props}
        ref={ref}
        onChange={handleChange}
        inputMode="numeric"
        placeholder="12.345.678-5"
      />
    );
  },
);

RutInput.displayName = "RutInput";
