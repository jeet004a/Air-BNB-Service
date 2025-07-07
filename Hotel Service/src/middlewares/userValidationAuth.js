import axios from 'axios'
import { config } from 'dotenv'
config()
export const userValidation = async(req, res, next) => {
    try {
        let token
        for (let i = 0; i < req.rawHeaders.length; i++) {
            if (req.rawHeaders[i].split(" ")[0] === 'Bearer') {
                token = req.rawHeaders[i]
            }
        }
        // console.log(token)
        // const token = req.rawHeaders[1]
        let response = await axios.get(process.env.USER_SERVICE_URL + '/profile', {
            headers: {
                authorization: token
            }
        })

        req.user = response.data.userDetails
        next()
    } catch (error) {
        console.log('User validation api call controller error', error)
    }
}