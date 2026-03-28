import { LoginController, logoutController} from "@/controllers/auth.controller.js";
import { requireLoginedHook } from "@/hooks/auth.hooks.js";
import "@fastify/auth";
import {
  LoginBody,
  LoginBodyType,
  LoginRes,
  LoginResType,
  LogoutBody,
  LogoutBodyType,
} from "@/schemaValidations/auth.schema.js";
import {
  MessageRes,
  MessageResType,
} from "@/schemaValidations/common.schema.js";
import { FastifyInstance, FastifyPluginOptions } from "fastify";

export default async function authRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  fastify.post<{ Reply: LoginResType; Body: LoginBodyType }>(
    "/login",
    {
      schema: {
        response: {
          200: LoginRes,
        },
        body: LoginBody,
      },
    },
    async (request, reply) => {
      console.log("Login request body:", request.body);
      const { body } = request;
      const { accessToken, refreshToken, account } =
        await LoginController(body);
      reply.send({
        message: "Đăng nhập thành công",
        data: {
          account: account as LoginResType["data"]["account"],
          accessToken,
          refreshToken,
        },
      });
    },
  );

  fastify.post<{ Reply: MessageResType; Body: LogoutBodyType }>(
    '/logout',
    {
      schema: {
        response: {
          200: MessageRes
        },
        body: LogoutBody
      },
      preValidation: fastify.auth([requireLoginedHook])
    },
    async (request, reply) => {
      const message = await logoutController(request.body.refreshToken)
      reply.send({
        message
      })
    }
  )
}
