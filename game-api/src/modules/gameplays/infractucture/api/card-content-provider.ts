import { CardContentProvider } from '../../application/card-content-provider';

export class ApiCardContentProvider implements CardContentProvider {
  private readonly apiUrl = 'https://challenge-uno.vercel.app/api/images';

  private readonly MAX_AMOUNT_AVAILABLE = 20;

  constructor() {}

  async getCardContents(amount: number) {
    const response = await fetch(this.apiUrl);

    const data = (await response.json()) as {
      url: string;
      uuid: string;
      title: string;
    }[];

    const cards = data.map((item) => ({
      title: item.title,
      url: item.url,
      id: item.uuid,
    }));

    if (amount > this.MAX_AMOUNT_AVAILABLE) {
      throw new Error(
        `Amount requested exceeds the maximum available. Max: ${this.MAX_AMOUNT_AVAILABLE}`,
      );
    }

    return cards.slice(0, amount);
  }
}
