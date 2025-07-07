import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
config()
export const generateToken = async(payload) => {
    try {
        // const { email } = payload
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
        return token
    } catch (error) {
        console.log('error in generateToken:', error);
    }
}

export const validateSignature = async(req) => {
    try {
        for (let i = 0; i < req.rawHeaders.length; i++) {
            if (req.rawHeaders[i].split(" ")[0] === 'Bearer') {
                const token = req.rawHeaders[i].split(" ")[1]
                const payload = await jwt.verify(token, process.env.JWT_SECRET)
                    // console.log('abc', payload)

                req.user = payload
                    // console.log("req", req.user)

            }
        }
        return true
    } catch (error) {
        console.log('error in validateSignature:', error);
    }
}