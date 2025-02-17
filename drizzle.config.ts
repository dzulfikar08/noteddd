import { defineConfig } from 'drizzle-kit'

import { env } from '@/env'

export default env.DB_LOCAL_PATH
  ? defineConfig({
      schema: './lib/db/schema.ts',
      dialect: 'sqlite',
      dbCredentials: {
        url: env.DB_LOCAL_PATH,
      },
    })
  : defineConfig({
      schema: './lib/db/schema.ts',
      out: './lib/db/migrations',
      dialect: 'sqlite',
      driver: 'd1-http',
      dbCredentials: {
        accountId: env.CLOUDFLARE_ACCOUNT_ID,
        databaseId: env.CLOUDFLARE_DATABASE_ID,
        token: env.CLOUDFLARE_D1_TOKEN,
      },
    })
