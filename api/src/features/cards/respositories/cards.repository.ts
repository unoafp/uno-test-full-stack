import { Injectable, Inject } from '@nestjs/common';
import { and, eq, inArray, ne } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DRIZZLE_MAIN } from 'src/database/drizzle.constants';
import { DrizzleDbOrTx } from 'src/database/types';
import {
  cardSchema,
  CardInsertModel,
  CardStatus,
} from 'src/features/cards/schemas/card.schema';

@Injectable()
export class CardsRepository {
  constructor(@Inject(DRIZZLE_MAIN) private readonly db: NodePgDatabase) {}

  async insertMany(items: CardInsertModel[], dbOrTx: DrizzleDbOrTx = this.db) {
    return dbOrTx.insert(cardSchema).values(items).returning();
  }

  async findUnmatchedCardsByGameId(
    gameId: string,
    dbOrTx: DrizzleDbOrTx = this.db,
  ) {
    return dbOrTx
      .select()
      .from(cardSchema)
      .where(
        and(eq(cardSchema.gameId, gameId), ne(cardSchema.status, 'match')),
      );
  }

  async findCardsByGameId(gameId: string, dbOrTx: DrizzleDbOrTx = this.db) {
    return dbOrTx
      .select()
      .from(cardSchema)
      .where(and(eq(cardSchema.gameId, gameId)))
      .orderBy(cardSchema.position);
  }

  async updateCardStatus(
    cardId: string,
    status: CardStatus,
    dbOrTx: DrizzleDbOrTx = this.db,
  ) {
    const [cardUpdated] = await dbOrTx
      .update(cardSchema)
      .set({ status })
      .where(eq(cardSchema.id, cardId))
      .returning();

    return cardUpdated;
  }

  async hideRevealedCardsByGameId(
    gameId: string,
    dbOrTx: DrizzleDbOrTx = this.db,
  ) {
    const updated = await dbOrTx
      .update(cardSchema)
      .set({ status: 'hidden' })
      .where(
        and(eq(cardSchema.gameId, gameId), eq(cardSchema.status, 'revealed')),
      )
      .returning();

    return updated;
  }

  async updateManyCardStatusByGameId(
    gameId: string,
    cardsId: string[],
    status: CardStatus,
    dbOrTx: DrizzleDbOrTx = this.db,
  ) {
    const updated = await dbOrTx
      .update(cardSchema)
      .set({ status: status })
      .where(
        and(eq(cardSchema.gameId, gameId), inArray(cardSchema.id, cardsId)),
      )
      .returning();

    return updated;
  }
}
