import bcrypt from "bcryptjs";

const saltRounds = 10
export const hashPassword = async (password: string) => bcrypt.hash(password, saltRounds)

export const comparePassword = async (password : string, hash : string) => bcrypt.compare(password, hash)