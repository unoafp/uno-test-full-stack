import { useFormContext, type ControllerRenderProps } from "react-hook-form";
import { FormField } from "../ui/form";
import FormFieldContainer from "./form-item-wrapper";

type ExtraProps = {
  name: string;
  label?: React.ReactNode;
  description?: string;
};

function withFormField<P>(Component: React.ComponentType<P>) {
  return (props: Omit<P, keyof ControllerRenderProps<any>> & ExtraProps) => {
    const { name, label, description, ...rest } = props as ExtraProps & P;
    const form = useFormContext();

    return (
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormFieldContainer label={label} description={description}>
            <Component {...(field as any)} {...(rest as P)} />
          </FormFieldContainer>
        )}
      />
    );
  };
}

export default withFormField;
