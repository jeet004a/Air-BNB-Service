import jwt from 'jsonwebtoken';
import { validateSignature } from '../utils/adminUtils.js';
export const userAuth = async(req, res, next) => {
    try {
        const user = await validateSignature(req)
        if (!user) {
            return res.status(404).json({ "Message": "Admin Not found" })
        }
        next()
    } catch (error) {
        console.error('Error in userAuth middleware:', error);
    }
}