import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';
import path from 'path';

// Load .env from project root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

if (!process.env.DATABASE_URL) {
  console.warn('⚠️ DATABASE_URL not found in environment');
}

export default {
  schema: './src/db/schema/users.ts',
  out: './src/db/migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL || 'postgres://latexia:latexia_password@localhost:5432/latexia',
  },
} satisfies Config;
