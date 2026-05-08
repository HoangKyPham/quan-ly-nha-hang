import { ManagerRoom, Role } from '@/constants/type.js'
import prisma from '@/database/index.js'
import { AuthError } from '@/utils/errors.js'
import { getChalk } from '@/utils/helpers.js'
import { verifyAccessToken } from '@/utils/jwt.js'
import fastifyPlugin from 'fastify-plugin'
import { Server as SocketIOServer } from 'socket.io'

export const socketPlugin = fastifyPlugin(async (fastify) => {
  const chalk = await getChalk()
  const io = new SocketIOServer(fastify.server, {
    cors: {
      origin: true,
      methods: ['GET', 'POST']
    }
  })

  fastify.decorate('io', io)

  fastify.addHook('onClose', (instance, done) => {
    instance.io.close()
    done()
  })

  fastify.io.use(async (socket, next) => {
    const Authorization = socket.handshake.auth.Authorization as
      | string
      | undefined
    if (!Authorization) {
      return next(new AuthError('Authorization không hợp lệ'))
    }
    const accessToken = Authorization.split(' ')[1]
    try {
      const decodedAccessToken = verifyAccessToken(accessToken)
      const { userId, role } = decodedAccessToken
      if (role === Role.Guest) {
        // upsert : Nếu đã tồn tại socketId thì cập nhật, nếu chưa thì tạo mới
        await prisma.socket.upsert({
          where: {
            guestId: userId
          },
          update: {
            socketId: socket.id
          },
          create: {
            guestId: userId,
            socketId: socket.id
          }
        })
      } else {
        await prisma.socket.upsert({
          where: {
            accountId: userId
          },
          update: {
            socketId: socket.id
          },
          create: {
            accountId: userId,
            socketId: socket.id
          }
        })
        socket.join(ManagerRoom)
      }
      ;(socket.handshake.auth as { decodedAccessToken?: unknown }).decodedAccessToken =
        decodedAccessToken
    } catch (error: any) {
      return next(error)
    }
    next()
  })
  fastify.io.on('connection', async (socket) => {
    console.log(chalk.cyanBright('🔌 Socket connected:'))

    console.log(chalk.cyanBright('🔌 Socket connected:', socket.id))
  })
})
