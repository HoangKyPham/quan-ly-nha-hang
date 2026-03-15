import { RoleValues } from "@/constants/type";
import z from "zod";

export const LoginBody = z
  .object({
    email: z.email(),
    password: z.string().min(6).max(100),
  })
  .strict();

export type LoginBodyType = z.TypeOf<typeof LoginBody>;

export const LoginRes = z.object({
  data: z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
    account: z.object({
      id: z.number(),
      name: z.string(),
      email: z.string(),
      role: z.enum(RoleValues),
    }),
  }),
  message: z.string(),
});

export type LoginResType = z.TypeOf<typeof LoginRes>;
