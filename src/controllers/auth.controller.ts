import envConfig from "@/config.js";
import prisma from "@/database/index.js";
import { LoginBodyType } from "@/schemaValidations/auth.schema.js";
import { RoleType } from "@/types/jwt.types.js";
import { comparePassword } from "@/utils/crypto.js";
import { EntityError } from "@/utils/errors.js";
import { signAccessToken, signRefreshToken } from "@/utils/jwt.js";
import { addMilliseconds } from "date-fns";
import ms, { StringValue } from "ms"

export const LoginController = async (body : LoginBodyType) => {
    const account = await prisma.account.findUnique({
        where : {
            email : body.email
        }
    })

    if(!account) {
        throw new EntityError([{message : "Email không tồn tại", field : "email"}])
    }
    const isPasswordMatch = await comparePassword(body.password, account.password)
    if(!isPasswordMatch) {
        throw new EntityError([{message : "Email hoặc mật khẩu không đúng", field : "password"}])
    }

    const accessToken = signAccessToken({
    userId: account.id,
    role: account.role as RoleType
  })
  const refreshToken = signRefreshToken({
    userId: account.id,
    role: account.role as RoleType
  })

   const refreshTokenExpiresAt = addMilliseconds(new Date(), ms(envConfig.REFRESH_TOKEN_EXPIRES_IN as StringValue) )

  await prisma.refreshToken.create({
    data: {
      accountId: account.id,
      token: refreshToken,
      expiresAt: refreshTokenExpiresAt
    }
  })
  return {
    account,
    accessToken,
    refreshToken
  }

}