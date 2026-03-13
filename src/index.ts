import envConfig from "@/config.js";
import Fastify from "fastify";



const fastify = Fastify ({
    logger : false
})

//run server

const start = async () => {
    try {
        await fastify.listen({
            port : envConfig.PORT
        })
        console.log(`Server is running at ${envConfig.PROTOCOL}://${envConfig.DOMAIN}:${envConfig.PORT}`)
    } catch (error) {
        fastify.log.error(error)
        process.exit(1)
    }
}

start()
