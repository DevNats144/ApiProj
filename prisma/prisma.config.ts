import { defineConfig } from 'prisma/config'

export default defineConfig({
  database: {
    adapter: 'mongodb',
    url: process.env.DATABASE_URL,
  },
})