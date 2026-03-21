import envConfig from "@/config.js";
import { initOwnerAccount } from "@/controllers/account.controller.js";
import validatorCompilerPlugin from "@/plugins/validatorComplier.plugin.js";
import authRoutes from "@/routes/auth.route.js";
import Fastify from "fastify";

const fastify = Fastify({
  logger: false,
});

//run server

const start = async () => {
  try {
    fastify.register(validatorCompilerPlugin)
    fastify.register(authRoutes, {
      prefix: '/auth'
    })

    await initOwnerAccount()
    await fastify.listen({
      port: envConfig.PORT,
    });
    console.log(
      `Server is running at ${envConfig.PROTOCOL}://${envConfig.DOMAIN}:${envConfig.PORT}`,
    );
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
};

start();
