import { boolean, text, pgTable, uuid, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { userSchema } from './user.schema';

export const refreshTokensTable = pgTable('refresh_tokens', {
  id: uuid('id').defaultRandom().primaryKey(),
  tokenHash: text('hash'),
  revoked: boolean('revoked').default(false),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),

  userId: uuid('user_id')
    .unique()
    .notNull()
    .references(() => userSchema.id, {
      onDelete: 'cascade',
    }),
});

export const refreshTokenRelations = relations(
  refreshTokensTable,
  ({ one }) => ({
    user: one(userSchema, {
      fields: [refreshTokensTable.userId],
      references: [userSchema.id],
    }),
  }),
);

export type RefreshTokenModel = typeof refreshTokensTable.$inferSelect;
