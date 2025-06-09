import { adminSignUpService, adminSignInService } from '../services/adminService.js'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcrypt';
import { ManagerDB } from '../DB/dbConnection.js'
import { manager } from '../schema/hotelSchema.js';
import { validationResult } from 'express-validator';
export const adminSignUpController = async(req, res, next) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: errors.array()
            })
        }
        const existingManager = await ManagerDB.select().from(manager).where(eq(manager.email, req.body.email))
            // console.log(existingManager.length)
        if (existingManager.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Hotel Admin already exists with this email",
            })
        }
        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        const response = await adminSignUpService({ userDetails: req.body, salt: salt, password: hashedPassword })

        if (response) {
            return res.status(200).json({
                success: true,
                message: "Hotel Admin Sign Up Successful",
                token: response
            })
        }
        return res.status(400).json({
            success: false,
            message: "Hotel Admin Sign Up Failed",
        })
    } catch (error) {
        console.log('error adminSignUpController', error)
    }
}

export const adminSignInController = async(req, res, next) => {
    try {
        const existingAdmin = await ManagerDB.select().from(manager).where(eq(manager.email, req.body.email))
        if (!existingAdmin || existingAdmin.length === 0) {
            return res.status(400).json({
                success: false,
                message: "User does not exist with this email",
            })
        }
        const payload = await adminSignInService(req.body)
        if (payload) {
            return res.status(200).json({
                success: true,
                message: "Hotel Admin signed in successfully",
                token: payload
            })
        }
        return res.status(400).json({
            success: false,
            message: "Hotel Admin Sign In Failed",
        })

    } catch (error) {
        console.log('error in adminSignInController', error)
    }
}

export const adminProfileController = async(req, res, next) => {
    try {
        return res.status(200).json({
            success: true,
            message: "Hotel Admin Profile",
            user: req.user
        })
    } catch (error) {
        console.log('error in adminProfileController:', error);
    }
}