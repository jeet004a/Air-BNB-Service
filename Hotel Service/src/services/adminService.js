import { ManagerDB } from '../DB/dbConnection.js'
import { manager } from '../schema/hotelSchema.js';
import { generateToken } from '../utils/adminUtils.js'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcrypt';


export const adminSignUpService = async(payload) => {
    try {
        const newUser = await ManagerDB.insert(manager).values({
            name: payload.userDetails.name,
            email: payload.userDetails.email,
            password: payload.password,
            salt: payload.salt,
            phone: payload.userDetails.phone
        })
        if (newUser.rowCount > 0) {
            const token = await generateToken({ email: payload.userDetails.email })
            return token
        }
        return null
    } catch (error) {
        console.log('error in adminSignUpService:', error);
    }
}

export const adminSignInService = async(payload) => {
    try {
        const existingAdmin = await ManagerDB.select().from(manager).where(eq(manager.email, payload.email))
        const passwordCheck = await bcrypt.hash(payload.password, existingAdmin[0].salt)
        if (existingAdmin[0].password === passwordCheck) {
            const token = await generateToken({ email: payload.email })
                // console.log('token:', token)
            return token
        }
        return null
    } catch (error) {
        console.log('error in adminSignInService:', error);
    }
}