import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';

export type DbConnection = ReturnType<typeof drizzle>;
export type DrizzleTx = Parameters<NodePgDatabase['transaction']>[0] extends (
  tx: infer T,
) => any
  ? T
  : never;

export type DrizzleDbOrTx = DrizzleTx | NodePgDatabase;
