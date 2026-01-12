import apiClient from "@/common/config/api/api-client.config";
import { useMutation } from "@tanstack/react-query";
import type { PublicCardModel } from "../types/card.types";
import type { GameModel } from "../types/game.types";
import { queryClient } from "@/common/providers/query-client";

interface Response {
  cards: PublicCardModel[];
  game: GameModel;
}

interface CreateNewGameDto {
  totalCards: number;
}

export const useCreateNewGame = () => {
  return useMutation({
    mutationKey: ["new-game"],
    mutationFn: async (data: CreateNewGameDto) => {
      return apiClient
        .post<Response>("/game/new", data)
        .then((res) => res.data);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["get-current-game"], data);
    },
  });
};
