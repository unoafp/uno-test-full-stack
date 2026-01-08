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

export const usersTable = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  rutBody: integer('rut_body').unique().notNull(),
  rutDv: char('rut_dv', { length: 1 }).notNull(),
  name: text().notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const userRelations = relations(usersTable, ({ one }) => ({
  refreshToken: one(refreshTokensTable, {
    fields: [usersTable.id],
    references: [refreshTokensTable.userId],
  }),
}));

export type UserModel = typeof usersTable.$inferSelect;
