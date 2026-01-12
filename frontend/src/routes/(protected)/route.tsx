import AuthGuard from "@/features/auth/components/guards/auth-guard";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(protected)")({
  component: RouteComponent,
});

function RouteComponent() {
  return <AuthGuard onAuthFailTo="/login" />;
}
