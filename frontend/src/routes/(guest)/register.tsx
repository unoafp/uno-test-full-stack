import RegisterCardForm from "@/features/auth/components/register-card-form";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/(guest)/register")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  return (
    <div className="h-screen flex items-center justify-center">
      <RegisterCardForm onSuccess={() => navigate({ to: "/login" })} />
    </div>
  );
}
