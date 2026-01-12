import * as React from "react";
import { Outlet, createRootRoute } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <React.Fragment>
      <div className="flex flex-col min-h-screen bg-gray-300">
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </React.Fragment>
  );
}
