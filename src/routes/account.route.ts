import { createEmployeeAccount, getAccountList } from "@/controllers/account.controller.js";
import { requireLoginedHook, requireOwnerHook } from "@/hooks/auth.hooks.js";
import {
  AccountListRes,
  AccountListResType,
  AccountRes,
  AccountResType,
  CreateEmployeeAccountBody,
  CreateEmployeeAccountBodyType,
} from "@/schemaValidations/account.schema.js";
import { FastifyInstance } from "fastify";

export default async function accountRoutes(fastify: FastifyInstance) {
  fastify.addHook("preValidation", fastify.auth([requireLoginedHook]));
  fastify.get<{ Reply: AccountListResType }>(
    "/",
    {
      schema: {
        response: {
          200: AccountListRes,
        },
      },
      preValidation: fastify.auth([requireOwnerHook]),
    },
    async (request, reply) => {
      const ownerAccountId = request.decodedAccessToken?.userId as number;
      const accounts = await getAccountList(ownerAccountId);
      reply.send({
        data: accounts,
        message: "Lấy danh sách nhân viên thành công",
      });
    },
  );

    fastify.post<{
    Body: CreateEmployeeAccountBodyType
    Reply: AccountResType
  }>(
    '/',
    {
      schema: {
        response: {
          200: AccountRes
        },
        body: CreateEmployeeAccountBody
      },
      preValidation: fastify.auth([requireOwnerHook])
    },
    async (request, reply) => {
      const account = await createEmployeeAccount(request.body)
      reply.send({
        data: account,
        message: 'Tạo tài khoản thành công'
      })
    }
  )

}
