import { relations } from 'drizzle-orm';
import {
  pgTable,
  uuid,
  integer,
  timestamp,
  pgEnum,
  text,
} from 'drizzle-orm/pg-core';
import { usersTable } from 'src/features/auth/schema/user.schema';
import { gamesTable } from './game.schema';

export const gameCardStatus = pgEnum('game_card_enum', [
  'hidden',
  'revealed',
  'match',
]);

export const gameCardsTable = pgTable('game_card', {
  id: uuid('id').defaultRandom().primaryKey(),
  gameId: uuid('game_id')
    .notNull()
    .references(() => gamesTable.id),
  userId: uuid('user_id')
    .unique()
    .notNull()
    .references(() => usersTable.id, {
      onDelete: 'cascade',
    }),

  title: text().notNull(),
  imageId: uuid('image_id').notNull(),
  position: integer('position').notNull(),
  status: gameCardStatus('groups').notNull().default('hidden'),

  createdAt: timestamp('created_at').defaultNow(),
});

export const gameCardsRelations = relations(gameCardsTable, ({ one }) => ({
  game: one(gamesTable, {
    fields: [gameCardsTable.gameId],
    references: [gamesTable.id],
  }),
}));
export type GameCardModel = typeof gameCardsTable.$inferSelect;
export type GameCardInsertModel = typeof gameCardsTable.$inferInsert;
