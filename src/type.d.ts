import { TokenPayload } from '@/types/jwt.types'
import { Account } from '@prisma/client'
import { type FastifyRequest, FastifyInstance, FastifyReply } from 'fastify'

// xử lý bigint khi trả về json
declare global {
  interface BigInt {
    toJSON(): string
  }
}

//mở rộng type của fastify để thêm decodedAccessToken vào request
declare module 'fastify' {
  interface FastifyInstance {}
  interface FastifyRequest {
    decodedAccessToken?: TokenPayload
  }
}
