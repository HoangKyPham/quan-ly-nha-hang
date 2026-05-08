import { Role } from '@/constants/type.js'
import {
  guestLoginController,
  guestRefreshTokenController
} from '@/controllers/guest.controller.js'
import {
  LogoutBody,
  LogoutBodyType,
  RefreshTokenBody,
  RefreshTokenBodyType,
  RefreshTokenRes,
  RefreshTokenResType
} from '@/schemaValidations/auth.schema.js'
import {
  GuestLoginBody,
  GuestLoginBodyType,
  GuestLoginRes,
  GuestLoginResType
} from '@/schemaValidations/guest.schema.js'
import { FastifyInstance, FastifyPluginOptions } from 'fastify'

export default async function guestRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  fastify.post<{ Reply: GuestLoginResType; Body: GuestLoginBodyType }>(
    '/auth/login',
    {
      schema: {
        response: {
          200: GuestLoginRes
        },
        body: GuestLoginBody
      }
    },
    async (request, reply) => {
      const { body } = request
      const result = await guestLoginController(body)
      reply.send({
        message: 'Đăng nhập thành công',
        data: {
          guest: {
            id: result.guest.id,
            name: result.guest.name,
            role: Role.Guest,
            tableNumber: result.guest.tableNumber,
            createdAt: result.guest.createdAt,
            updatedAt: result.guest.updatedAt
          },
          accessToken: result.accessToken,
          refreshToken: result.refreshToken
        }
      })
    }
  )
 

  fastify.post<{
    Reply: RefreshTokenResType
    Body: RefreshTokenBodyType
  }>(
    '/auth/refresh-token',
    {
      schema: {
        response: {
          200: RefreshTokenRes
        },
        body: RefreshTokenBody
      }
    },
    async (request, reply) => {
      const result = await guestRefreshTokenController(request.body.refreshToken)
      reply.send({
        message: 'Lấy token mới thành công',
        data: result
      })
    }
  )
}
 