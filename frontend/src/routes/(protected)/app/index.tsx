import { Button } from "@/components/ui/button";
import ContainerBox from "@/components/ui/container-box";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Play, Trophy } from "lucide-react";

export const Route = createFileRoute("/(protected)/app/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ContainerBox className="flex flex-col flex-1 items-center justify-center">
      <div className="flex flex-col gap-4">
        <h1 className="font-bold tracking-tight text-balance text-center">
          Memorice
        </h1>
        <div className="grid grid-cols-2 gap-2">
          <Button asChild size="lg" className="gap-2 min-w-45">
            <Link to="/app/game">
              <Play className="w-5 h-5" />
              Iniciar Juego
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="gap-2 min-w-45"
          >
            <Link to="/app/stats">
              <Trophy className="w-5 h-5" />
              Ver Puntajes
            </Link>
          </Button>
        </div>
      </div>
    </ContainerBox>
  );
}
