import z from "zod";

export const AccountSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  role: z.string(),
  avatar: z.string().nullable()
})


export const AccountRes = z.object({
    data : AccountSchema,
    message: z.string(),
}).strict()

export type AccountResType = z.TypeOf<typeof AccountRes>