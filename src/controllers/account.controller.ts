import envConfig from "@/config.js"
import { Role } from "@/constants/type.js"
import prisma from "@/database/index.js"
import { hashPassword } from "@/utils/crypto.js"
import { getChalk } from "@/utils/helpers.js"



export const initOwnerAccount = async () => {
    const accountCount = await prisma.account.count()
    if (accountCount === 0) {
        const hashPass = await hashPassword(envConfig.INITIAL_PASSWORD_OWNER)
        await prisma.account.create({
            data : {
                name : "Owner",
                email : envConfig.INITIAL_EMAIL_OWNER,
                password : hashPass,
                role : Role.Owner
            }
        })
        const chalk = await getChalk()
        console.log(chalk.green(`Đã tạo tài khoản Owner với email: ${envConfig.INITIAL_EMAIL_OWNER} và mật khẩu: ${envConfig.INITIAL_PASSWORD_OWNER}`))
    }
}