import jwt from 'jsonwebtoken';
import { validateSignature } from '../utils/userUtils.js';
export const userAuth = async(req, res, next) => {
    try {
        // console.log(req.headers)
        const user = await validateSignature(req)
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User Not found"
            })
        }
        next()
    } catch (error) {
        console.error('Error in userAuth middleware:', error);
    }
}