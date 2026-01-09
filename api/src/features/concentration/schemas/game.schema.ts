import { relations } from 'drizzle-orm';
import { pgTable, uuid, integer, timestamp } from 'drizzle-orm/pg-core';
import { usersTable } from 'src/features/auth/schema/user.schema';
import { gameCardsTable } from './game-cards.schema';

export const gamesTable = pgTable('game', {
  id: uuid('id').defaultRandom().primaryKey(),
  totalCards: integer('total_cards').notNull(),
  moves: integer('moves').default(0),
  errors: integer('errors').default(0),

  userId: uuid('user_id')
    .unique()
    .notNull()
    .references(() => usersTable.id, {
      onDelete: 'cascade',
    }),
  createdAt: timestamp('created_at').defaultNow(),
});

export const gameRelations = relations(gamesTable, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [gamesTable.userId],
    references: [usersTable.id],
  }),
  cards: many(gameCardsTable),
}));
