import { Game } from '../domain/game';
import { CardContentProvider } from './card-content-provider';

export class GameGenerator {
  private MAX_ATTEMPTS = 10;
  private MAX_PAIRS = 10;

  constructor(private readonly provider: CardContentProvider) {}

  async execute() {
    const game = Game.create(this.MAX_ATTEMPTS);

    const contents = await this.provider.getCardContents(this.MAX_PAIRS);

    const cardContents = contents.map((item) => ({
      title: item.title,
      url: item.url,
      value: item.id,
    }));

    game.generateDeck(cardContents);

    return game;
  }
}
