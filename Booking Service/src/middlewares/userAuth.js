import axios from 'axios'
import { config } from 'dotenv'
config()

export const userAuth = async(req, res, next) => {
    try {
        // console.log(req.headers)
        const response = await axios.get(process.env.USER_SERVICE_URL + `/auth/profile`, {
            headers: {
                authorization: req.headers.authorization
            }
        })

        // console.log('hello',)
        req.user = response.data.userDetails
        next()
    } catch (error) {
        // console.log('error from admin auth middleware booking service', error)
        return res.status(500).json({
            success: false,
            message: "Failed to validate user / User not found",
        });
    }
}