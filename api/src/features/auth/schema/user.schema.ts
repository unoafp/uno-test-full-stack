import {
  text,
  uuid,
  timestamp,
  integer,
  char,
  pgTable,
  AnyPgColumn,
} from 'drizzle-orm/pg-core';
import { refreshTokensTable } from './resfresh-token.schema';
import { relations } from 'drizzle-orm';
import { gameSchema } from 'src/features/game/schemas/game.schema';

export const userSchema = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  rutBody: integer('rut_body').unique().notNull(),
  rutDv: char('rut_dv', { length: 1 }).notNull(),
  name: text().notNull(),
  currentGameId: uuid('current_game_id')
    .unique()
    .default(null)
    .references((): AnyPgColumn => gameSchema.id),
  createdAt: timestamp('created_at').defaultNow(),
});

export const userRelations = relations(userSchema, ({ one, many }) => ({
  refreshToken: one(refreshTokensTable, {
    fields: [userSchema.id],
    references: [refreshTokensTable.userId],
  }),
  games: many(gameSchema),
  currentGame: one(gameSchema, {
    fields: [userSchema.currentGameId],
    references: [gameSchema.id],
  }),
}));

export type UserModel = typeof userSchema.$inferSelect;
