import { relations } from 'drizzle-orm';
import {
  pgTable,
  uuid,
  integer,
  timestamp,
  pgEnum,
  text,
} from 'drizzle-orm/pg-core';
import { gameSchema } from '../../game/schemas/game.schema';

export const gameCardStatusEnum = pgEnum('card_status_enum', [
  'hidden',
  'revealed',
  'match',
]);

export const cardSchema = pgTable('card', {
  id: uuid('id').defaultRandom().primaryKey(),
  gameId: uuid('game_id')
    .notNull()
    .references(() => gameSchema.id),

  title: text().notNull(),
  imageId: uuid('image_id').notNull(),
  position: integer('position').notNull(),
  status: gameCardStatusEnum('status').notNull().default('hidden'),

  createdAt: timestamp('created_at').defaultNow(),
});

export const cardsRelations = relations(cardSchema, ({ one }) => ({
  game: one(gameSchema, {
    fields: [cardSchema.gameId],
    references: [gameSchema.id],
  }),
}));
export type CardModel = typeof cardSchema.$inferSelect;
export type CardInsertModel = typeof cardSchema.$inferInsert;
export type CardStatus = (typeof gameCardStatusEnum.enumValues)[number];
