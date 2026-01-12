import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/app")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <div className="flex flex-col min-h-screen bg-gray-300">
        <div className="w-full bg-red-200">Navbar</div>
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </>
  );
}
