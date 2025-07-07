import { config } from 'dotenv'
import axios from 'axios'
config()


export const adminAuth = async(req, res, next) => {
    try {

        const response = await axios.get(process.env.HOTEL_ADMIN_SERVICE_URL + `/admin/profile`, {
            headers: {
                authorization: req.headers.authorization
            }
        })
        if (response.data.success == true) {
            req.admin = response.data.user
            next()
        }
        // return res.status(400).json({
        //     success: false,
        //     message: "You are not admin to perform this operation"
        // })
    } catch (error) {
        // console.log('error from admin auth booking service middlewares', error)
        return res.status(500).json({
            success: false,
            message: "Failed to validate admin / Admin not found",
        });
    }
}