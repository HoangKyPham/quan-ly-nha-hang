import envConfig from "@/config.js";
import { TokenType } from "@/constants/type.js";
import { TokenPayload } from "@/types/jwt.types.js";
import { createSigner, createVerifier, SignerOptions } from "fast-jwt";
import ms, { StringValue } from 'ms'


export const signAccessToken = (
    payload : Pick<TokenPayload, 'userId' | 'role'> & {
        exp ?: number
    },
    options?: SignerOptions
) => {
    const {exp, ...restPayload} = payload
    const signSync = createSigner({
        key : envConfig.ACCESS_TOKEN_SECRET,
        algorithm : "HS256",
        expiresIn : payload.exp ?? ms(envConfig.ACCESS_TOKEN_EXPIRES_IN as StringValue),
        ...options
    })
    return signSync({...restPayload, tokenType : TokenType.AccessToken})
}
export const signRefreshToken = (
    payload : Pick<TokenPayload, 'userId' | 'role'> & {
        exp ?: number
    },
    options?: SignerOptions
) => {
    const {exp, ...restPayload} = payload
    const signSync = createSigner({
        key : envConfig.REFRESH_TOKEN_SECRET,
        algorithm : "HS256",
        expiresIn : payload.exp ?? ms(envConfig.REFRESH_TOKEN_EXPIRES_IN as StringValue),
        ...options
    })
    return signSync({...restPayload, tokenType : TokenType.RefreshToken})
}

export const verifyAccessToken = (token : string) => {
    const verifySync = createVerifier({
        key : envConfig.ACCESS_TOKEN_SECRET
    })
    return verifySync(token) as TokenPayload
}
