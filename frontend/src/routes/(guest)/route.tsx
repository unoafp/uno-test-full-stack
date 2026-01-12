import GuestGuard from "@/features/auth/components/guards/guest-guard";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(guest)")({
  component: RouteComponent,
});

function RouteComponent() {
  return <GuestGuard navigateTo="/app" />;
}
