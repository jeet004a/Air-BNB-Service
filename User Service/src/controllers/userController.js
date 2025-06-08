import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import { userSignUpService, userSignInService } from '../services/userService.js';
import { User } from '../DB/userSchema.js'
import { userDB } from '../DB/dbConnection.js'
import { eq } from 'drizzle-orm'
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
        if (existingUser) {
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
        // console.log(req.body)
        console.log(req.user)
        return res.status(200).json({
            success: true,
            message: "User profile fetched successfully",
            user: req.user.email
                // user: req.user
        })
    } catch (error) {
        console.log('error in userProfile:', error);
    }
}