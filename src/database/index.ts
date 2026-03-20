import envConfig from "@/config.js";
import { PrismaClient } from "@prisma/client/extension";



const prisma = new PrismaClient({
    datasourceUrl : envConfig.DATABASE_URL,
    log : ['info']
})

export default prisma