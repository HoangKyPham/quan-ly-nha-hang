import envConfig from "@/config.js";
import { initOwnerAccount } from "@/controllers/account.controller.js";
import validatorCompilerPlugin from "@/plugins/validatorComplier.plugin.js";
import accountRoutes from "@/routes/account.route.js";
import authRoutes from "@/routes/auth.route.js";
import dishRoutes from "@/routes/dish.route.js";
import mediaRoutes from "@/routes/media.route.js";
import tablesRoutes from "@/routes/table.route.js";
import { createFolder } from "@/utils/helpers.js";
import fastifyAuth from "@fastify/auth";
import Fastify from "fastify";
import path from 'path'

const fastify = Fastify({
  logger: false,
});

//run server

const start = async () => {
  try {
    createFolder(path.resolve(envConfig.UPLOAD_FOLDER))
    fastify.register(validatorCompilerPlugin);
    fastify.register(fastifyAuth, {
      defaultRelation: "and",
    });
    fastify.register(authRoutes, {
      prefix: "/auth",
    });
    fastify.register(accountRoutes, {
      prefix: '/accounts'
    })
    fastify.register(mediaRoutes, {
      prefix: '/media'
    })
    fastify.register(dishRoutes, {
      prefix: '/dishes'
    })
     fastify.register(tablesRoutes, {
      prefix: '/tables'
    })

    await initOwnerAccount();
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
