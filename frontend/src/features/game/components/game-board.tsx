import React from "react";
import type { GameModel } from "../types/game.types";
import type { PublicCardModel } from "../types/card.types";
import { MemoriceCard } from "./memorice-card";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { Link } from "@tanstack/react-router";

interface Props {
  game: GameModel;
  cards: PublicCardModel[];
}

const GameBoard: React.FC<Props> = ({ game, cards }) => {
  return (
    <Card className="w-full">
      <CardHeader className="grid grid-cols-3">
        <div className="">
          <h2 className="text-blue-500">Movimientos: {game.moves}</h2>
          <h2 className="text-red-500">Errores: {game.errors}</h2>
        </div>
        <div className="text-center">
          {game.status === "finished" && <h2>Felicidades!!</h2>}
        </div>
        <div className="flex justify-end">
          <Button asChild>
            <Link to="/app/game/new">
              <Play /> Jugar otra vez
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-8 ">
          {cards.map((card) => {
            return (
              <div key={card.id} className="w-full flex justify-center">
                <MemoriceCard card={card} />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default GameBoard;
