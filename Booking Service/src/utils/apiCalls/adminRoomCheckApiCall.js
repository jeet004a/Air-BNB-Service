import axios from 'axios'
import { config } from 'dotenv'
config()



export const adminRoomCheckValidation = async(payload) => {
    try {
        // console.log(payload)
        const response = await axios.get(process.env.HOTEL_ADMIN_SERVICE_URL + `/room/admin/rooms/validation`, {
            headers: {
                authorization: payload.token
            },
            params: {
                hotelId: payload.hotelId,
                roomId: payload.roomId
            }
        })
        if (response) {
            return true
        }
        return false
    } catch (error) {
        console.log('error from admin room check api call from booking service', error)
    }
}