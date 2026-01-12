import apiClient from "@/common/config/api/api-client.config";
import { useQuery } from "@tanstack/react-query";
import type { GameModel } from "../types/game.types";
import type { PublicCardModel } from "../types/card.types";

export interface ActiveGame {
  game: GameModel;
  cards: PublicCardModel[];
}
export const useGetActiveGame = () => {
  return useQuery({
    queryKey: ["get-current-game"],
    queryFn: async () => {
      return apiClient.get<ActiveGame>("/game/current").then((res) => res.data);
    },
  });
};
