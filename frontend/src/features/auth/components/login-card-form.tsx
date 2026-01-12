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
import { Link } from "@tanstack/react-router";
import { Form } from "@/components/ui/form";
import { useLogin } from "../hooks/use-login";
import { InputForm } from "@/components/forms";
import type { ToUrlString } from "@/types";

const loginSchema = yup.object({
  rut: yup.string().required("Rut valido requerido."),
});

type LoginFormData = yup.InferType<typeof loginSchema>;

interface LoginCardProps {
  registerUrl: ToUrlString;
}

const LoginCardForm: React.FC<LoginCardProps> = ({ registerUrl }) => {
  const { mutate: login, isPending } = useLogin();

  const form = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      rut: "",
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    login(data);
  });

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Iniciar sesión</CardTitle>
        <CardDescription>
          Ingresa tus credenciales para acceder a tu cuenta
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={onSubmit}>
          <CardContent className="space-y-4 mb-2">
            <InputForm name="rut" label="Rut" placeholder="Rut" />
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                "Iniciar sesión"
              )}
            </Button>

            <p className="text-center text-sm text-gray-600">
              ¿No tienes una cuenta?{" "}
              <Link to={registerUrl} className="text-primary hover:underline">
                Regístrate
              </Link>
            </p>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};
export default LoginCardForm;
