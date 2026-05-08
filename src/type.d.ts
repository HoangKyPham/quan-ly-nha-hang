import { TokenPayload } from '@/types/jwt.types'
import { Account } from '@prisma/client'
import { type FastifyRequest, FastifyInstance, FastifyReply } from 'fastify'
import type { Server as SocketIOServer } from 'socket.io'

// xử lý bigint khi trả về json
declare global {
  interface BigInt {
    toJSON(): string
  }
}

//mở rộng type của fastify để thêm decodedAccessToken vào request
declare module 'fastify' {
  interface FastifyInstance {
    io: SocketIOServer
  }
  interface FastifyRequest {
    decodedAccessToken?: TokenPayload
  }
}
