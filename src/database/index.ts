import envConfig from '@/config.js'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import { PrismaClient } from '@prisma/client'

const adapter = new PrismaBetterSqlite3({
  url: envConfig.DATABASE_URL.replace('file:', '')
})

const prisma = new PrismaClient({
  adapter,
  log: ['info']
})

export default prisma
