import { LoginController } from "@/controllers/auth.controller.js";
import {
  LoginBody,
  LoginBodyType,
  LoginRes,
  LoginResType,
} from "@/schemaValidations/auth.schema.js";
import { FastifyInstance, FastifyPluginOptions } from "fastify";

export default async function authRoutes(fastify: FastifyInstance) {
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
}
