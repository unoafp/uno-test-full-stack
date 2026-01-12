import LoginCardForm from "@/features/auth/components/login-card-form";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(guest)/login")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <div className="h-screen flex items-center justify-center">
        <LoginCardForm registerUrl="/register" />
      </div>
    </>
  );
}
