import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { ImageApiResponse } from './types/images-api.types';
import { duplicateDeck, shuffleDeck, takeCards } from './utils/deck.utils';
import { DRIZZLE_MAIN } from 'src/database/drizzle.constants';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { gamesTable } from './schemas/game.schema';
import { CurrentUser } from '../auth/strategies/jwt.strategy';
import {
  GameCardInsertModel,
  gameCardsTable,
} from './schemas/game-cards.schema';

@Injectable()
export class ConcentrationService {
  constructor(
    private readonly configService: ConfigService,
    @Inject(DRIZZLE_MAIN) private readonly db: NodePgDatabase,
  ) {}
  async generateNewDeck(totalCards: number, user: CurrentUser) {
    const rest = totalCards % 2;
    if (rest !== 0)
      throw new BadRequestException('Quantity of cards must be even.');

    const pairs = totalCards / 2;

    const apiUrl = this.configService.getOrThrow<string>('IMAGES_API');
    const cardsList = await axios
      .get<ImageApiResponse[]>(apiUrl)
      .then((res) => res.data);

    const selectedCards = takeCards(cardsList, pairs);
    const fullDeck = duplicateDeck(selectedCards);
    const finalDeck = shuffleDeck(fullDeck);

    const result = await this.db.transaction(async (tx) => {
      const [game] = await tx
        .insert(gamesTable)
        .values({
          totalCards: totalCards,
          userId: user.sub,
        })
        .returning();
      const items: GameCardInsertModel[] = finalDeck.map((card, idx) => ({
        gameId: game.id,
        title: card.title,
        imageId: card.uuid,
        userId: user.sub,
        position: idx,
      }));
      const gameCards = await tx
        .insert(gameCardsTable)
        .values(items)
        .returning();

      return { game, gameCards };
    });
    return result;
  }
}
