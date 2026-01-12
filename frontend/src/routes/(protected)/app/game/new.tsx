import ContainerBox from "@/components/ui/container-box";
import CreateNewGame from "@/features/game/components/new-game-button";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(protected)/app/game/new")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ContainerBox className="flex flex-1 justify-center items-center">
      <CreateNewGame />
    </ContainerBox>
  );
}
