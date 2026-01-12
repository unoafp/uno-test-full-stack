import type { ComponentProps } from "react";
import withFormField from "./with-form-fields";
import { Input, type InputProps } from "../ui/input";
import { Textarea } from "../ui/textarea";
export { default as CheckboxForm } from "./checkbox-form";

export const InputForm = withFormField<InputProps>(Input);
export const TextareaForm = withFormField<ComponentProps<"textarea">>(Textarea);
