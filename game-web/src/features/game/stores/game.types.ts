export type GameCard = {
  id: string;
  value: string;
  url: string;
  label: string;
  isFlipped: boolean;
  isMatched: boolean;
};

export interface GameResult {
  id: string;
  playerName: string;
  playerNickname: string;
  totalPairs: number;
  correctPairs: number;
  attempts: number;
  maxAttempts: number;
  won: boolean;
  date: string;
}

export type GameStatus = "playing" | "won" | "lost" | "loading";

export type GameplayStore = {
  cards: GameCard[];
  attemps: number;
  flippedIds: string[];
  correctPairs: number;
  gameStatus: GameStatus;
  start: () => void;
  maxAttemps: number;
  flipCard: (id: string) => void;
  timeoutId: NodeJS.Timeout | null;
  totalPairs: number;
  loadCard: (
    card: {
      id: string;
      value: string;
      url: string;
      label: string;
    }[],
    maxAttems: number,
  ) => void;
};
