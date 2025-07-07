import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import { userSignUpService, userSignInService } from '../services/userService.js';
import { User } from '../DB/userSchema.js'
import { userDB } from '../DB/dbConnection.js'
import { eq, sql } from 'drizzle-orm'
import { userAcivityLogger } from '../logger/userActivityLogger.js'
export const signUpController = async(req, res, next) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: errors.array()
            })
        }

        const existingUser = await userDB.select().from(User).where(eq(User.email, req.body.email))
            // console.log(existingUser)
        if (existingUser.length > 0) {
            userAcivityLogger.error(`User already exists with this email ${req.body.email}`)
            return res.status(400).json({
                success: false,
                message: "User already exists with this email",
            })
        }
        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        const response = await userSignUpService({ userDetails: req.body, salt: salt, password: hashedPassword })
        return res.status(201).json({
            success: true,
            message: "User signed up successfully",
            token: response
        })
    } catch (error) {
        console.log('error', error)
    }
}

export const signInController = async(req, res, next) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: errors.array()
            })
        }
        const existingUser = await userDB.select().from(User).where(eq(User.email, req.body.email))
        if (!existingUser || existingUser.length === 0) {
            userAcivityLogger.error(`User does not exist with this email ${req.body.email}`)
            return res.status(400).json({
                success: false,
                message: "User does not exist with this email",
            })
        }
        const payload = await userSignInService(req.body)
        return res.status(200).json({
            success: true,
            message: "User signed in successfully",
            token: payload
        })
    } catch (error) {
        console.log('error in signInController:', error);
    }
}


export const userProfile = async(req, res, next) => {
    try {
        const userDetails = await userDB.execute(sql `select * from users where email=${req.user.email} `)
            // console.log()
        return res.status(200).json({
            success: true,
            message: "User profile fetched successfully",
            user: req.user.email,
            userDetails: userDetails.rows[0]
        })
    } catch (error) {
        console.log('error in userProfile:', error);
    }
}