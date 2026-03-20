import bcrypt from "bcryptjs";


export const comparePassword = async (password : string, hash : string) => bcrypt.compare(password, hash)