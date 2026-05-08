import envConfig from "@/config.js";
import { initOwnerAccount } from "@/controllers/account.controller.js";
import validatorCompilerPlugin from "@/plugins/validatorComplier.plugin.js";
import accountRoutes from "@/routes/account.route.js";
import authRoutes from "@/routes/auth.route.js";
import dishRoutes from "@/routes/dish.route.js";
import guestRoutes from "@/routes/guest.route.js";
import mediaRoutes from "@/routes/media.route.js";
import tablesRoutes from "@/routes/table.route.js";
import { createFolder } from "@/utils/helpers.js";
import fastifyAuth from "@fastify/auth";
import Fastify from "fastify";
import path from 'path'
import cors from '@fastify/cors'
import { socketPlugin } from "@/plugins/socket.plugins.js";
import { errorHandlerPlugin } from "@/plugins/errorHandler.plugins.js";
import fastifyCookie from "@fastify/cookie";
import fastifyHelmet from "@fastify/helmet";
import staticRoutes from "@/routes/static.route.js";
import orderRoutes from "@/routes/order.route.js";

const fastify = Fastify({
  logger: false,
});

//run server

const start = async () => {
  try {
    createFolder(path.resolve(envConfig.UPLOAD_FOLDER))
    const whitelist = ['*']
    fastify.register(cors, {
      origin: whitelist, // Cho phép tất cả các domain gọi API
      credentials: true, // Cho phép trình duyệt gửi cookie đến server
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
    })
    
    fastify.register(validatorCompilerPlugin);
    fastify.register(fastifyAuth, {
      defaultRelation: "and",
    });
      fastify.register(fastifyHelmet, {
      crossOriginResourcePolicy: {
        policy: 'cross-origin'
      }
    })
    fastify.register(fastifyCookie);
    fastify.register(errorHandlerPlugin);
    fastify.register(socketPlugin)
    fastify.register(authRoutes, {
      prefix: "/auth",
    });
    fastify.register(accountRoutes, {
      prefix: '/accounts'
    })
    fastify.register(mediaRoutes, {
      prefix: '/media'
    })
     fastify.register(staticRoutes, {
      prefix: '/static'
    })
    fastify.register(dishRoutes, {
      prefix: '/dishes'
    })
     fastify.register(tablesRoutes, {
      prefix: '/tables'
    })
     fastify.register(orderRoutes, {
      prefix: '/orders'
    })
    fastify.register(guestRoutes, {
      prefix: '/guest'
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
