import envConfig from "@/config.js";
import { TokenType } from "@/constants/type.js";
import { TokenPayload } from "@/types/jwt.types.js";
import { parseDuration } from "@/utils/duration.js";
import {
  createSigner,
  createVerifier,
  PrivateKey,
  SignerOptions,
} from "fast-jwt";

export const signAccessToken = (
  payload: Pick<TokenPayload, "userId" | "role"> & {
    exp?: number;
  },
  options?: SignerOptions,
) => {
  const { exp } = payload;
  const optionSigner: Partial<
    SignerOptions & { key: string | Buffer | PrivateKey }
  > = exp
    ? {
        key: envConfig.ACCESS_TOKEN_SECRET,
        algorithm: "HS256",
        ...options,
      }
    : {
        key: envConfig.ACCESS_TOKEN_SECRET,
        algorithm: "HS256",
        expiresIn: parseDuration(
          envConfig.ACCESS_TOKEN_EXPIRES_IN,
          "ACCESS_TOKEN_EXPIRES_IN",
        ),
        ...options,
      };
  const signSync = createSigner(optionSigner);
  return signSync({ ...payload, tokenType: TokenType.AccessToken });
};
export const signRefreshToken = (
  payload: Pick<TokenPayload, "userId" | "role"> & {
    exp?: number;
  },
  options?: SignerOptions,
) => {
  const { exp } = payload;
  const optionSigner: Partial<
    SignerOptions & { key: string | Buffer | PrivateKey }
  > = exp
    ? {
        key: envConfig.REFRESH_TOKEN_SECRET,
        algorithm: "HS256",
        ...options,
      }
    : {
        key: envConfig.REFRESH_TOKEN_SECRET,
        algorithm: "HS256",
        expiresIn: parseDuration(
          envConfig.REFRESH_TOKEN_EXPIRES_IN,
          "REFRESH_TOKEN_EXPIRES_IN",
        ),
        ...options,
      };
  const signSync = createSigner(optionSigner);
  return signSync({ ...payload, tokenType: TokenType.RefreshToken });
};

export const verifyAccessToken = (token: string) => {
  const verifySync = createVerifier({
    key: envConfig.ACCESS_TOKEN_SECRET,
  });
  return verifySync(token) as TokenPayload;
};

export const verifyRefreshToken = (token: string) => {
  const verifySync = createVerifier({
    key: envConfig.REFRESH_TOKEN_SECRET
  })
  return verifySync(token) as TokenPayload
}

