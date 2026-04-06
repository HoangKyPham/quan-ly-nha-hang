import { Role, TokenType } from "@/constants/type.js";

export type TokenTypeValue = (typeof TokenType)[keyof typeof TokenType]
export type RoleType = (typeof Role)[keyof typeof Role]
export interface TokenPayload {
  userId: number
  role: RoleType
  tokenType: TokenTypeValue
  exp: number
  iat: number
}