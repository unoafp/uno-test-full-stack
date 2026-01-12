import apiClient from "@/common/config/api/api-client.config";
import { useMutation } from "@tanstack/react-query";
import type { PublicCardModel } from "../types/card.types";
import type { GameModel } from "../types/game.types";
import { queryClient } from "@/common/providers/query-client";
import type { ActiveGame } from "./use-get-active-game";

interface Response {
  cards: PublicCardModel[];
  game: GameModel;
}
export const useRevealCard = (cardId: string) => {
  return useMutation({
    mutationKey: ["reveal-card", cardId],
    mutationFn: async () => {
      return apiClient
        .post<Response>("/game/current/reveal", { cardId })
        .then((res) => res.data);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["get-current-game"], (prev: ActiveGame) => {
        const activeGameCopy = { ...prev };
        activeGameCopy.game = data.game;
        activeGameCopy.cards = activeGameCopy.cards.map((item) => {
          const match = data.cards.find((card) => card.id === item.id);
          if (match) console.log("match", match);
          return match ?? item;
        });
        return { ...activeGameCopy };
      });
    },
  });
};
