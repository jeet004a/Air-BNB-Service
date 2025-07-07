import jwt from 'jsonwebtoken';
import { validateSignature } from '../utils/adminUtils.js';
export const adminAuth = async(req, res, next) => {
    try {
        const user = await validateSignature(req)
            // console.log('abcxxx', req.user)
        if (!req.user) {
            return res.status(404).json({ "Message": "Admin Not found" })
        }
        next()
    } catch (error) {
        console.error('Error in userAuth middleware:', error);
    }
}