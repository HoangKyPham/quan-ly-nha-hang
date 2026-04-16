import envConfig from "@/config.js";
import { PrismaErrorCode } from "@/constants/error-reference.js";
import { Role } from "@/constants/type.js";
import prisma from "@/database/index.js";
import {
  ChangePasswordBodyType,
  CreateEmployeeAccountBodyType,
  UpdateEmployeeAccountBodyType,
  UpdateMeBodyType,
} from "@/schemaValidations/account.schema.js";
import { comparePassword, hashPassword } from "@/utils/crypto.js";
import {
  EntityError,
  isPrismaClientKnownRequestError,
} from "@/utils/errors.js";
import { getChalk } from "@/utils/helpers.js";

export const initOwnerAccount = async () => {
  const accountCount = await prisma.account.count();
  if (accountCount === 0) {
    const hashPass = await hashPassword(envConfig.INITIAL_PASSWORD_OWNER);
    await prisma.account.create({
      data: {
        name: "Owner",
        email: envConfig.INITIAL_EMAIL_OWNER,
        password: hashPass,
        role: Role.Owner,
      },
    });
    const chalk = await getChalk();
    console.log(
      chalk.green(
        `Đã tạo tài khoản Owner với email: ${envConfig.INITIAL_EMAIL_OWNER} và mật khẩu: ${envConfig.INITIAL_PASSWORD_OWNER}`,
      ),
    );
  }
};

export const getAccountList = async (accountId: number) => {
  const account = await prisma.account.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where: {
      id: {
        not: accountId,
      },
    },
  });
  return account;
};

export const getEmployeeAccount = async (accountId: number) => {
  const account = await prisma.account.findUniqueOrThrow({
    where: {
      id: accountId,
    },
  });
  return account;
};

export const createEmployeeAccount = async (
  body: CreateEmployeeAccountBodyType,
) => {
  try {
    const hashedPassword = await hashPassword(body.password);
    const account = await prisma.account.create({
      data: {
        name: body.name,
        email: body.email,
        password: hashedPassword,
        role: Role.Employee,
        avatar: body.avatar,
      },
    });
    return account;
  } catch (error: any) {
    // xác định đúng là lỗi Prisma
    if (isPrismaClientKnownRequestError(error)) {
      if (error.code === PrismaErrorCode.UniqueConstraintViolation) {
        throw new EntityError([
          { field: "email", message: "Email đã tồn tại" },
        ]);
      }
    }
    throw error;
  }
};

export const updateEmployeeAccount = async (
  accountId: number,
  body: UpdateEmployeeAccountBodyType,
) => {
  try {
    if (body.changePassword) {
      const hashedPassword = await hashPassword(body.password!);
      const account = await prisma.account.update({
        where: {
          id: accountId,
        },
        data: {
          name: body.name,
          email: body.email,
          avatar: body.avatar,
          password: hashedPassword,
        },
      });
      return account;
    } else {
      const account = await prisma.account.update({
        where: {
          id: accountId,
        },
        data: {
          name: body.name,
          email: body.email,
          avatar: body.avatar,
        },
      });
      return account;
    }
  } catch (error: any) {
    if (isPrismaClientKnownRequestError(error)) {
      if (error.code === PrismaErrorCode.UniqueConstraintViolation) {
        throw new EntityError([
          { field: "email", message: "Email đã tồn tại" },
        ]);
      }
    }
    throw error;
  }
};

export const deleteEmployeeAccount = async (accountId: number) => {
  return prisma.account.delete({
    where: {
      id: accountId,
    },
  });
};
export const getMeController = async (accountId: number) => {
  const account = prisma.account.findUniqueOrThrow({
    where: {
      id: accountId,
    },
  });
  return account;
};

export const changePasswordController = async (
  accountId: number,
  body: ChangePasswordBodyType,
) => {
  const account = await prisma.account.findUniqueOrThrow({
    where: {
      id: accountId,
    },
  });
  const isSame = await comparePassword(body.oldPassword, account.password);
  if (!isSame) {
    throw new EntityError([
      { field: "oldPassword", message: "Mật khẩu cũ không đúng" },
    ]);
  }
  const hashedPassword = await hashPassword(body.password);
  const newAccount = await prisma.account.update({
    where: {
      id: accountId,
    },
    data: {
      password: hashedPassword,
    },
  });
  return newAccount;
};

export const updateMeController = async (
  accountId: number,
  body: UpdateMeBodyType,
) => {
  const account = prisma.account.update({
    where: {
      id: accountId,
    },
    data: body,
  });
  return account;
};
