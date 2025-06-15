import { User } from '../DB/userSchema.js'
import { config } from 'dotenv';
config()
import { userDB } from '../DB/dbConnection.js'
import { generateToken } from '../utils/userUtils.js'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcrypt';
import { sendEmailNotification, handleLoginNotificationService } from './snsNotificationService.js'
import { userAcivityLogger } from '../logger/userActivityLogger.js'


export const userSignUpService = async(payload) => {
    try {
        const newUser = await userDB.insert(User).values({
            firstname: payload.userDetails.firstname,
            lastname: payload.userDetails.lastname,
            email: payload.userDetails.email,
            password: payload.password,
            salt: payload.salt
        })
        if (newUser.rowCount > 0) {
            const token = await generateToken({ email: payload.userDetails.email })
            await sendEmailNotification(payload.userDetails.email)
            return token
        }

        return false
    } catch (error) {
        console.log('error in userService:', error);
    }
}

export const userSignInService = async(payload) => {
    try {
        const existingUser = await userDB.select().from(User).where(eq(User.email, payload.email))
        const passwordCheck = await bcrypt.hash(payload.password, existingUser[0].salt)
        if (existingUser[0].password === passwordCheck) {
            const token = await generateToken({ email: payload.email })
                // console.log('token:', token)
            userAcivityLogger.info(`User Successfully Logged in user - ${payload.email}`)
            await handleLoginNotificationService(payload.email)
            return token
        }

    } catch (error) {
        console.log('error in userSignInService:', error);
    }
}