import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Form } from "@/components/ui/form";
import { InputForm } from "@/components/forms";
import { isValidRut } from "../utils/rut.utils";
import { useRegister } from "../hooks/user-register";

const registerFormSchema = yup.object({
  rut: yup
    .string()
    .trim()
    .required("Rut valido requerido.")
    .test("is-valid-rut", "Rut inválido.", (value) => {
      if (!value) return false;
      return isValidRut(value);
    }),
  name: yup.string().required("Rut requerido."),
});

type RegisterFormType = yup.InferType<typeof registerFormSchema>;

interface LoginCardProps {
  onSuccess?: () => void;
}

const RegisterCardForm: React.FC<LoginCardProps> = ({ onSuccess }) => {
  const { mutate: register, isPending } = useRegister();

  const form = useForm<RegisterFormType>({
    resolver: yupResolver(registerFormSchema),
    defaultValues: {
      rut: "",
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    register(data, {
      onSuccess: () => onSuccess?.(),
    });
  });

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Registro</CardTitle>
        <CardDescription>Ingresa tus datos para registrarte</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={onSubmit}>
          <CardContent className="space-y-4 mb-2">
            <InputForm name="rut" label="Rut" placeholder="Rut" />
            <InputForm name="name" label="Nombre" placeholder="John Doe" />
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Procesando
                </>
              ) : (
                "Registrarse"
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};
export default RegisterCardForm;
