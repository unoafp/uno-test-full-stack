export type CardContentDTO = {
  id: string;
  title: string;
  url: string;
};

export type CardContentProvider = {
  getCardContents: (amount: number) => Promise<CardContentDTO[]>;
};
