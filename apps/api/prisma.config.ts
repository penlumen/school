/// <reference types="node" />
import { defineConfig } from 'prisma/config';
import 'dotenv/config';

// Bun loads .env natively, no dotenv needed here.
export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: process.env.DATABASE_URL!,
  },
});
