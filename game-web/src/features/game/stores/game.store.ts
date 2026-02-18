import { GameplayStore, GameStatus } from "./game.types";
import { createStore } from "zustand/vanilla";

export const createGameplayStore = () =>
  createStore<GameplayStore>((set) => ({
    attemps: 0,
    cards: [],
    correctPairs: 0,
    flippedIds: [],
    gameStatus: "loading",
    maxAttemps: 0,
    timeoutId: null,
    totalPairs: 0,
    start: () => {
      set((state) => {
        if (state.timeoutId) clearTimeout(state.timeoutId);

        return {
          attemps: 0,
          cards: state.cards.map((c) => ({
            ...c,
            isFlipped: false,
            isMatched: false,
          })),
          gameStatus: "playing",
          correctPairs: 0,
          flippedIds: [],
          timeoutId: null,
        };
      });
    },
    loadCard: (
      cards: {
        id: string;
        value: string;
        url: string;
        label: string;
      }[],
      maxAttemps: number,
    ) =>
      set((state) => {
        if (state.timeoutId) clearTimeout(state.timeoutId);

        return {
          attemps: 0,
          cards: cards.map((c) => ({
            ...c,
            isFlipped: true,
            isMatched: false,
          })),
          gameStatus: "loading",
          correctPairs: 0,
          flippedIds: [],
          maxAttemps,
          timeoutId: null,
          totalPairs: cards.length / 2,
        };
      }),
    flipCard: (id: string) => {
      let shouldResolve = false;

      set((state) => {
        if (state.flippedIds.length >= 2 || state.flippedIds.includes(id)) {
          return state;
        }

        const newFlipped = [...state.flippedIds, id];

        shouldResolve = newFlipped.length === 2;

        return {
          cards: state.cards.map((c) =>
            c.id === id ? { ...c, isFlipped: true } : c,
          ),
          flippedIds: newFlipped,
        };
      });

      // ✅ Only resolve when 2 cards are flipped
      if (!shouldResolve) return;

      const timeout = setTimeout(() => {
        set((state) => {
          const [a, b] = state.flippedIds;
          const first = state.cards.find((c) => c.id === a);
          const second = state.cards.find((c) => c.id === b);

          if (!first || !second) return state;

          const isMatch = first.value === second.value;

          const newAttemps = state.attemps + 1;

          const newCards = state.cards.map((c) =>
            c.id === a || c.id === b
              ? {
                  ...c,
                  isMatched: isMatch,
                  isFlipped: isMatch,
                }
              : c,
          );

          const isAllMatched = newCards.every((c) => c.isMatched);

          let newStatus: GameStatus = state.gameStatus;

          if (isAllMatched) {
            newStatus = "won";
          } else if (newAttemps >= state.maxAttemps) {
            newStatus = "lost";
          }

          return {
            cards: newCards,
            flippedIds: [],
            attemps: newAttemps,
            correctPairs: isMatch ? state.correctPairs + 1 : state.correctPairs,
            timeoutId: null,
            gameStatus: newStatus,
          };
        });
      }, 800);

      set({ timeoutId: timeout });
    },
  }));
