import envConfig from "@/config.js"
import { Role, TableStatus } from "@/constants/type.js"
import prisma from "@/database/index.js"
import { GuestLoginBodyType } from "@/schemaValidations/guest.schema.js"
import { TokenPayload } from "@/types/jwt.types.js"
import { parseDuration } from "@/utils/duration.js"
import { AuthError } from "@/utils/errors.js"
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "@/utils/jwt.js"




export const guestLoginController = async (body: GuestLoginBodyType) => {
  const table = await prisma.table.findUnique({
    where: {
      number: body.tableNumber,
      token: body.token
    }
  })
  if (!table) {
    throw new Error('Bàn không tồn tại hoặc mã token không đúng')
  }

  if (table.status === TableStatus.Hidden) {
    throw new Error('Bàn này đã bị ẩn, hãy chọn bàn khác để đăng nhập')
  }

  if (table.status === TableStatus.Reserved) {
    throw new Error('Bàn đã được đặt trước, hãy liên hệ nhân viên để được hỗ trợ')
  }

  let guest = await prisma.guest.create({
    data: {
      name: body.name,
      tableNumber: body.tableNumber
    }
  })
  const refreshToken = signRefreshToken(
    {
      userId: guest.id,
      role: Role.Guest
    },
    {
      expiresIn: parseDuration(envConfig.GUEST_REFRESH_TOKEN_EXPIRES_IN, "GUEST_REFRESH_TOKEN_EXPIRES_IN")
    }
  )
  const accessToken = signAccessToken(
    {
      userId: guest.id,
      role: Role.Guest
    },
    {
      expiresIn: parseDuration(envConfig.GUEST_ACCESS_TOKEN_EXPIRES_IN, "GUEST_ACCESS_TOKEN_EXPIRES_IN")
    }
  )
  const decodedRefreshToken = verifyRefreshToken(refreshToken)
  const refreshTokenExpiresAt = new Date(decodedRefreshToken.exp * 1000)

  guest = await prisma.guest.update({
    where: {
      id: guest.id
    },
    data: {
      refreshToken,
      refreshTokenExpiresAt
    }
  })

  return {
    guest,
    accessToken,
    refreshToken
  }
}


export const guestRefreshTokenController = async (refreshToken: string) => {
  let decodedRefreshToken: TokenPayload
  try {
    decodedRefreshToken = verifyRefreshToken(refreshToken)
  } catch (error) {
    throw new AuthError('Refresh token không hợp lệ')
  }
  const newRefreshToken = signRefreshToken({
    userId: decodedRefreshToken.userId,
    role: Role.Guest,
    exp: decodedRefreshToken.exp
  })
  const newAccessToken = signAccessToken(
    {
      userId: decodedRefreshToken.userId,
      role: Role.Guest
    },
    {
      expiresIn: parseDuration(envConfig.GUEST_ACCESS_TOKEN_EXPIRES_IN, "GUEST_ACCESS_TOKEN_EXPIRES_IN")
    }
  )
  await prisma.guest.update({
    where: {
      id: decodedRefreshToken.userId
    },
    data: {
      refreshToken: newRefreshToken,
      refreshTokenExpiresAt: new Date(decodedRefreshToken.exp * 1000)
    }
  })

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken
  }
}