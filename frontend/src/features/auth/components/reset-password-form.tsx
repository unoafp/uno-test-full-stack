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
import StrongPasswordViewer from "@/components/forms/strong-password-viewer";
import useResetPassword from "../hooks/use-reset-password";

const changePassword = yup.object({
  password: yup.string().required("Contraseña es requerida."),
  newPassword: yup
    .string()
    .required("Contraseña es requerida.")
    .oneOf([yup.ref("password")], "Las contraseñas deben coincidir"),
});

type LoginFormData = yup.InferType<typeof changePassword>;

interface Props {
  onSuccess: () => void;
  token: string;
}

const ResetPasswordForm: React.FC<Props> = ({ onSuccess, token }) => {
  const { mutate, isPending } = useResetPassword();

  const form = useForm<LoginFormData>({
    resolver: yupResolver(changePassword),
    defaultValues: {
      password: "",
      newPassword: "",
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    mutate(
      {
        password: data.password,
        token: token,
      },
      {
        onSuccess,
      }
    );
  });

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">
          Cambio de contraseña
        </CardTitle>
        <CardDescription>Ingresa la nueva contraseña</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 mb-2">
            <InputForm
              name="password"
              label="Nueva contraseña"
              placeholder="Ingresar Contraseña"
              type="password"
            />
            <StrongPasswordViewer value={form.watch("password")} />

            <InputForm
              name="newPassword"
              label="Repetir contraseña"
              type="password"
              placeholder="Repetir contraseña"
            />
          </CardContent>
          <CardFooter className="mt-6">
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                </>
              ) : (
                "Establecer contraseña"
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};
export default ResetPasswordForm;
