import envConfig from "@/config.js";
import prisma from "@/database/index.js";
import { LoginBodyType } from "@/schemaValidations/auth.schema.js";
import { RoleType, TokenPayload } from "@/types/jwt.types.js";
import { comparePassword } from "@/utils/crypto.js";
import { AuthError, EntityError } from "@/utils/errors.js";
import { signAccessToken, signRefreshToken, verifyAccessToken } from "@/utils/jwt.js";
import { addMilliseconds } from "date-fns";
import ms, { StringValue } from "ms";

export const LoginController = async (body: LoginBodyType) => {
  const account = await prisma.account.findUnique({
    where: {
      email: body.email,
    },
  });

  if (!account) {
    throw new EntityError([{ message: "Email không tồn tại", field: "email" }]);
  }
  const isPasswordMatch = await comparePassword(
    body.password,
    account.password,
  );
  if (!isPasswordMatch) {
    throw new EntityError([
      { message: "Email hoặc mật khẩu không đúng", field: "password" },
    ]);
  }

  const accessToken = signAccessToken({
    userId: account.id,
    role: account.role as RoleType,
  });
  const refreshToken = signRefreshToken({
    userId: account.id,
    role: account.role as RoleType,
  });

  const refreshTokenExpiresAt = addMilliseconds(
    new Date(),
    ms(envConfig.REFRESH_TOKEN_EXPIRES_IN as StringValue),
  );

  await prisma.refreshToken.create({
    data: {
      accountId: account.id,
      token: refreshToken,
      expiresAt: refreshTokenExpiresAt,
    },
  });
  return {
    account,
    accessToken,
    refreshToken,
  };
};

export const logoutController = async (refreshToken: string) => {
  await prisma.refreshToken.delete({
    where: {
      token: refreshToken
    }
  })
  return 'Đăng xuất thành công'
}

export const refreshTokenController = async (refreshToken: string) => {
  let decodedToken : TokenPayload
  try {
    decodedToken = verifyAccessToken(refreshToken)
  } catch (error) {
    throw new AuthError("Refresh token không hợp lệ hoặc đã hết hạn")
  }
  const refreshTokenDoc = await prisma.refreshToken.findFirstOrThrow({
    where : {
      token : refreshToken,
    },
    include : {
      account : true
    }
  })

  const account = refreshTokenDoc.account
  const newAccessToken = signAccessToken({
    userId: account.id,
    role: account.role as RoleType,
  })
  // Token Rotation: tạo một refresh token mới và xóa refresh token cũ để tăng cường bảo mật
  // nhưng vẫn giữ thời gian sống của refresh token mới = refresh token cũ 
  // tránh việc người dùng bị đăng xuất khi đang sử dụng ứng dụng
  const newRefreshToken = signRefreshToken(
    {
      userId : account.id,
      role : account.role as RoleType
    },
    {
      expiresIn : decodedToken.exp
    }
  )
  await prisma.refreshToken.delete({
    where : {
      token : refreshToken
    }
  })
  await prisma.refreshToken.create({
    data : {
      accountId : account.id,
      token : newRefreshToken,
      expiresAt : refreshTokenDoc.expiresAt
    }
  })
  return {
    accessToken : newAccessToken,
    refreshToken : newRefreshToken
  }

}


