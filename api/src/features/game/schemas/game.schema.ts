import { relations } from 'drizzle-orm';
import { pgTable, uuid, integer, timestamp } from 'drizzle-orm/pg-core';
import { userSchema } from 'src/features/auth/schema/user.schema';
import { cardSchema } from '../../cards/schemas/card.schema';
import { pgEnum } from 'drizzle-orm/pg-core';

export const gameStatusEnum = pgEnum('game_status_enum', [
  'active',
  'finished',
]);

export const gameSchema = pgTable('game', {
  id: uuid('id').defaultRandom().primaryKey(),
  totalCards: integer('total_cards').notNull(),
  moves: integer('moves').default(0),
  errors: integer('errors').default(0),
  status: gameStatusEnum('status').notNull().default('active'),
  userId: uuid('user_id')
    .notNull()
    .references(() => userSchema.id, {
      onDelete: 'cascade',
    }),
  createdAt: timestamp('created_at').defaultNow(),
});

export const gameRelations = relations(gameSchema, ({ one, many }) => ({
  user: one(userSchema, {
    fields: [gameSchema.userId],
    references: [userSchema.id],
  }),
  cards: many(cardSchema),
}));

export type GameModel = typeof gameSchema.$inferSelect;
