import { Injectable, Inject } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DRIZZLE_MAIN } from 'src/database/drizzle.constants';
import { GameModel, gameSchema } from '../schemas/game.schema';
import { and, count, desc, eq, sql } from 'drizzle-orm';
import { DrizzleDbOrTx } from 'src/database/types';

@Injectable()
export class GamesRepository {
  constructor(@Inject(DRIZZLE_MAIN) private readonly db: NodePgDatabase) {}

  async create(
    userId: string,
    totalCards: number,
    dbOrTx: DrizzleDbOrTx = this.db,
  ): Promise<GameModel> {
    const [game] = await dbOrTx
      .insert(gameSchema)
      .values({
        userId,
        totalCards,
      })
      .returning();

    return game;
  }

  async findById(
    id: string,
    dbOrTx: DrizzleDbOrTx = this.db,
  ): Promise<GameModel | null> {
    const [game] = await dbOrTx
      .select()
      .from(gameSchema)
      .where(eq(gameSchema.id, id));

    return game ?? null;
  }

  async registerMove(
    id: string,
    isMatch: boolean,
    dbOrTx: DrizzleDbOrTx = this.db,
  ) {
    return dbOrTx
      .update(gameSchema)
      .set({
        moves: sql`${gameSchema.moves} + 1`,
        errors: isMatch
          ? sql`${gameSchema.errors}`
          : sql`${gameSchema.errors} + 1`,
      })
      .where(eq(gameSchema.id, id))
      .returning();
  }

  async registerFinalMove(id: string, dbOrTx: DrizzleDbOrTx = this.db) {
    return dbOrTx
      .update(gameSchema)
      .set({
        moves: sql`${gameSchema.moves} + 1`,
        status: 'finished',
      })
      .where(and(eq(gameSchema.id, id), eq(gameSchema.status, 'active')))
      .returning();
  }

  async countActiveGames(userId: string, dbOrTx: DrizzleDbOrTx = this.db) {
    const [result] = await dbOrTx
      .select({ total: count(gameSchema.id) })
      .from(gameSchema)
      .where(
        and(eq(gameSchema.status, 'active'), eq(gameSchema.userId, userId)),
      )
      .groupBy(gameSchema.userId);
    return result?.total || 0;
  }

  async findCurrentGame(userId: string, dbOrTx: DrizzleDbOrTx = this.db) {
    const [result] = await dbOrTx
      .select()
      .from(gameSchema)
      .where(
        and(eq(gameSchema.status, 'active'), eq(gameSchema.userId, userId)),
      )
      .limit(1);
    return result;
  }
  async findFinishedGame(
    userId: string,
    gameId: string,
    dbOrTx: DrizzleDbOrTx = this.db,
  ) {
    return await dbOrTx
      .select()
      .from(gameSchema)
      .where(
        and(
          eq(gameSchema.id, gameId),
          eq(gameSchema.userId, userId),
          eq(gameSchema.status, 'finished'),
        ),
      )
      .limit(1);
  }

  async findFinishedGamesByUserId(
    userId: string,
    dbOrTx: DrizzleDbOrTx = this.db,
  ) {
    return dbOrTx
      .select()
      .from(gameSchema)
      .where(
        and(eq(gameSchema.userId, userId), eq(gameSchema.status, 'finished')),
      )
      .orderBy(desc(gameSchema.createdAt));
  }
}
