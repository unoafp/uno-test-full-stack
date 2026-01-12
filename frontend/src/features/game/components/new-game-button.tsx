import React, { useState } from "react";
import { useCreateNewGame } from "../hooks/use-create-new-game";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "@tanstack/react-router";

const options: number[] = [4, 6, 8, 10, 12, 14, 16];
const CreateNewGame = () => {
  const nav = useNavigate();
  const { mutate: crateNewGame, isPending } = useCreateNewGame();
  const [totalCards, setTotalCards] = useState(options[2]);
  const handleOnClick = () => {
    crateNewGame(
      { totalCards },
      {
        onSuccess: () => {
          nav({ to: "/app/game" });
        },
      }
    );
  };

  return (
    <Card className="w-100">
      <CardHeader>
        <CardTitle>Iniciar nuevo juego</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-y-4">
        <div className="flex items-center justify-between gap-2">
          <span>Cantidad de cartas</span>{" "}
          <Select
            value={totalCards.toString()}
            onValueChange={(value) => setTotalCards(Number(value))}
            disabled={isPending}
          >
            <SelectTrigger className="w-45">
              <SelectValue placeholder="Selecciona la cantidad de cartas" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Cantidad de cartas</SelectLabel>
                {options.map((item) => (
                  <SelectItem key={item} value={item.toString()}>
                    {item}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleOnClick} disabled={isPending}>
          <Play />
          Iniciar juego nuevo
        </Button>
      </CardContent>
    </Card>
  );
};

export default CreateNewGame;
