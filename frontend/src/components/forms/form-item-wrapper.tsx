import React from "react";
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
interface FormFieldContainerProps {
  label?: string | React.ReactNode | undefined;
  description?: string | undefined;
  children: React.ReactNode;
}

const FormFieldContainer: React.FC<FormFieldContainerProps> = (props) => {
  const { label, description, children } = props;
  return (
    <FormItem className="h-full">
      {label && <FormLabel className="h-4">{label}</FormLabel>}
      <FormControl>{children}</FormControl>
      {description && <FormDescription>{description}</FormDescription>}
      <FormMessage />
    </FormItem>
  );
};

export default FormFieldContainer;
