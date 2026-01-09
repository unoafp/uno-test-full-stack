import {
  pgTable,
  text,
  uuid,
  timestamp,
  integer,
  char,
} from 'drizzle-orm/pg-core';
import { refreshTokensTable } from './resfresh-token.schema';
import { relations } from 'drizzle-orm';
import { gamesTable } from 'src/features/concentration/schemas/game.schema';

export const usersTable = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  rutBody: integer('rut_body').unique().notNull(),
  rutDv: char('rut_dv', { length: 1 }).notNull(),
  name: text().notNull(),
  currentGame: uuid('current_game')
    .unique()
    .notNull()
    .references(() => usersTable.id, {
      onDelete: 'cascade',
    }),

  createdAt: timestamp('created_at').defaultNow(),
});

export const userRelations = relations(usersTable, ({ one, many }) => ({
  refreshToken: one(refreshTokensTable, {
    fields: [usersTable.id],
    references: [refreshTokensTable.userId],
  }),
  games: many(gamesTable),
}));

export type UserModel = typeof usersTable.$inferSelect;
