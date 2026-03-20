import { LoginBody, LoginBodyType, LoginRes, LoginResType } from "@/schemaValidations/auth.schema.js";
import { FastifyInstance } from "fastify";



// export default async function authRoutes(fastify: FastifyInstance) {
//     fastify.post<{Reply : LoginResType, Body : LoginBodyType}>(
//         "/login", 
//         {
//             schema : {
//                 response : {
//                     200 : LoginRes
//                 },
//                 body : LoginBody
//             }
//         }),
//         async (request, reply) => {
//             const {body} = request

            
//         }
// }   