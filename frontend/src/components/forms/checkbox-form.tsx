import { useFormContext } from "react-hook-form";
import { FormField } from "../ui/form";
import FormFieldContainer from "./form-item-wrapper";
import type React from "react";
import type { ComponentProps, FC } from "react";
import { Checkbox } from "../ui/checkbox";

interface Props extends ComponentProps<typeof Checkbox> {
  name: string;
  label?: string | React.ReactNode | undefined;
  description?: string | undefined;
}

const CheckboxForm: FC<Props> = (props) => {
  const { name, label, description, ...rest } = props;
  const form = useFormContext();
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        console.log(field.value);

        return (
          <FormFieldContainer label={label} description={description}>
            <Checkbox
              {...rest}
              checked={field.value}
              onCheckedChange={field.onChange}
              ref={field.ref}
            />
          </FormFieldContainer>
        );
      }}
    />
  );
};

export default CheckboxForm;
