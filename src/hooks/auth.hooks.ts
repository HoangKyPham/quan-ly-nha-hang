import { AuthError } from "@/utils/errors.js";
import { verifyAccessToken } from "@/utils/jwt.js";
import { FastifyRequest } from "fastify";


export const requireLoginedHook = async (request : FastifyRequest) => {
    const accessToken = request.headers.authorization?.split(" ")[1];
    if(!accessToken) throw new AuthError("Không nhận được access token");
    try {
        const decodedAccessToken = verifyAccessToken(accessToken);
        request.decodedAccessToken = decodedAccessToken
    } catch (error) {
        throw new AuthError("Access token không hợp lệ");
    }
}