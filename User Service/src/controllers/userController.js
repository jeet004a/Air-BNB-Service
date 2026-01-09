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
        // console.log(req.body)
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
        //If you want to grab all details user below query
        // const userDetails = await userDB.execute(sql `select * from users where email=${req.user.email} `)
        // console.log()
        const userDetails = await userDB.execute(sql `select id,firstname,lastname,email from users where email=${req.user.email} `)
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


export const userInfoController = async(req, res, next) => {
    try {
        const { id } = req.params

        const response = await userDB.execute(`select id, email,firstname,lastname,created_at from users where id=${id}`)
            // console.log(response.rows)
        if (response.rows.length > 0) {
            return res.status(200).json({
                success: true,
                msg: 'Msg from server',
                data: response.rows[0]
            })
        }
        return res.status(400).json({
            success: false,
            msg: `User is not found by id ${id}`
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            msg: "Something went wrong"
        })
    }
}

export const userUpdateController = async(req, res, next) => {
    try {
        const { firstname, lastname } = req.body
        const response = await userDB.execute(sql `update users set firstname=${firstname} , lastname=${lastname} where email=${req.user.email} RETURNING id,firstname,lastname,email,created_at`)

        if (response.rows.length > 0) {
            return res.status(200).json({
                success: true,
                msg: 'User Info updated successfully',
                data: response.rows[0]
            })
        }

        return res.status(400).json({
            success: false,
            msg: 'User is not updated successfully'
        })
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            success: false,
            msg: "Something went wrong while updating the User",
            error
        })
    }
}