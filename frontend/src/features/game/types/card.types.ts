export type CardModel = {
  id: string;
  status: "match" | "hidden" | "revealed";
  createdAt: Date;
  gameId: string;
  title: string;
  imageId: string;
  position: number;
};

export type PublicCardModel = {
  id: string;
  status: "match" | "hidden" | "revealed";
  imageUrl: string;
  title: string;
  position: number;
};
