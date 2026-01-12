import ContainerBox from "@/components/ui/container-box";
import LoadingScreen from "@/features/auth/components/loading-screen";
import GameBoard from "@/features/game/components/game-board";
import { useGetActiveGame } from "@/features/game/hooks/use-get-active-game";
import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/(protected)/app/game/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: game, isFetching } = useGetActiveGame();

  if (isFetching) return <LoadingScreen />;

  if (!game) return <Navigate to="/app/game/new" />;
  return (
    <ContainerBox className="flex flex-1 justify-center items-center">
      <GameBoard {...game} />
    </ContainerBox>
  );
}
