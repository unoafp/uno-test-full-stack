import { drizzle } from 'drizzle-orm/node-postgres';

export type DbConnection = ReturnType<typeof drizzle>;
