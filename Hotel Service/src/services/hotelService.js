import { manager, hotel } from '../schema/hotelSchema.js'
import { ManagerDB, HotelDB } from '../DB/dbConnection.js'
export const createHotelService = async(req, host_id) => {
    try {
        // const response = await
        const data = {
            name: req.body.name,
            description: req.body.description,
            roomCapacity: req.body.roomCapacity,
            address: req.body.address,
            city: req.body.city,
            country: req.body.country,
            pincode: req.body.pincode,
            hostId: host_id
        }
        const response = await HotelDB.insert(hotel).values(data).returning()
            // console.log(response)
        if (response.length > 0) {
            return response; // Hotel created successfully
        }
        return false
    } catch (error) {
        console.log('Error in createHotelService:', error);
    }
}