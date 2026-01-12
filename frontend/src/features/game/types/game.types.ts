export type GameModel = {
  id: string;
  totalCards: number;
  moves: number;
  errors: number;
  status: "finished" | "active";
  createdAt: Date;
  userId: string;
};
