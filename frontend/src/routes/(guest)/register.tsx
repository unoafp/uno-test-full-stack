import RegisterCardForm from "@/features/auth/components/register-card-form";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(guest)/register")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="h-screen flex items-center justify-center">
      <RegisterCardForm />
    </div>
  );
}
