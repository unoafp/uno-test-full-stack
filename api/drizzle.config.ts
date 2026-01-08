import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

process.env.DATABASE_URL = `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.POSTGRES_DB}`;

export default defineConfig({
  out: './drizzle',
  schema: './src/**/*.schema.ts', // <-- detecta todos los schemas
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
});
