import { Card } from './card';

type CardContent = {
  title: string;
  url: string;
  value: string;
};

export class Game {
  constructor(
    private readonly id: string,
    private cards: Card[],
    private maxAttempts: number,
  ) {}

  static create(maxAttempts: number) {
    const id = crypto.randomUUID();

    return new Game(id, [], maxAttempts);
  }

  generateDeck(cards: CardContent[]) {
    const gameCards = cards.reduce((acc, card) => {
      const [original, pair] = this.createPair(card);
      return [...acc, original, pair];
    }, []);

    const suffledCards = this.suffleCards(gameCards);

    this.cards = suffledCards;
  }

  private createPair(data: CardContent): [Card, Card] {
    return Card.createPair(data.title, data.url, data.value);
  }

  private suffleCards(cards: Card[]): Card[] {
    const array = [...cards];

    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
  }

  getId() {
    return this.id;
  }

  getDeck() {
    return this.cards;
  }

  getTotalPairs() {
    return this.cards.length / 2;
  }

  getMaxAttempts() {
    return this.maxAttempts;
  }
}
