import { RoleValues } from "@/constants/type.js";
import z, { email } from "zod";


export const LoginBody = z.object({
    email : z.email(),
    password : z.string().min(6).max(100)
}).strict()

export type LoginBodyType = z.TypeOf<typeof LoginBody>

export const LoginRes = z.object({
    data : z.object({
        accessToken : z.string(),
        refreshToken : z.string(),
        account : z.object({
            id : z.number(),
            email : z.string(),
            name : z.string(),
            role : z.enum(RoleValues)
        })
    }),
    message : z.string()
})

export type LoginResType = z.TypeOf<typeof LoginRes>

export const LogoutBody = z
  .object({
    refreshToken: z.string()
  })
  .strict()

export type LogoutBodyType = z.TypeOf<typeof LogoutBody>

export const RefreshTokenBody = z
  .object({
    refreshToken: z.string()
  })
  .strict()

export type RefreshTokenBodyType = z.TypeOf<typeof RefreshTokenBody>

export const RefreshTokenRes = z.object({
  data: z.object({
    accessToken: z.string(),
    refreshToken: z.string()
  }),
  message: z.string()
})

export type RefreshTokenResType = z.TypeOf<typeof RefreshTokenRes>

