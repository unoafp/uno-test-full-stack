import { InputForm } from "@/components/forms";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as yup from "yup";
import useForgotPassword from "../hooks/use-forgot-password";

const formSchema = yup.object({
  email: yup.string().email().required("El usuario es requrido."),
});

type FormData = yup.InferType<typeof formSchema>;

const ForgotPasswordForm = () => {
  const { mutate: resetPasswordRequest } = useForgotPassword();
  const form = useForm<FormData>({
    resolver: yupResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });
  const handleSubmit = form.handleSubmit((data) => {
    console.log(data);
    resetPasswordRequest(data.email, {
      onSuccess: () => {
        toast.success("Se ha enviado el enlace a tu correo");
      },
    });
  });
  return (
    <Card className="min-w-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Recuperar contraseña
        </CardTitle>

        <CardDescription>
          Ingresa tu correo electrónico y te enviaremos un enlace para
          restablecer tu contraseña.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={handleSubmit} className="w-full">
            <InputForm
              name={"email"}
              type="email"
              label="Correo"
              placeholder="john@doe.com"
            />
            <Button type="submit" className="w-full mt-4">
              Enviar por correo
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ForgotPasswordForm;
