import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(protected)/app/stats/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/app/stats"!</div>;
}
