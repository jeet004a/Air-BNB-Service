import { manager, hotel, room } from '../schema/hotelSchema.js'
import { ManagerDB, HotelDB, RoomDB } from '../DB/dbConnection.js'
import { eq, sql } from 'drizzle-orm'

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


export const updateRoomCapacityService = async(payload) => {
    try {
        const existingRoomCount = await RoomDB.execute(sql `select count(*) from room where room.hotel_id=${payload.hotelId}`)
        if (payload.roomCapacity < Number(existingRoomCount.rows[0].count)) {
            return `You already have total listed room ${Number(existingRoomCount.rows[0].count)} please add more than this capacity`
        } else {
            const response = await HotelDB.execute(sql `update hotel set room_capacity=${payload.roomCapacity-Number(existingRoomCount.rows[0].count)} where id=${payload.hotelId}`)
                // console.log(typeof(existingRoomCount.rows[0].count), existingRoomCount.rows[0].count)
            return `Now remaining room capacity ${payload.roomCapacity-Number(existingRoomCount.rows[0].count)} becuase your already listed ${Number(existingRoomCount.rows[0].count)} number of rooms`
        }
    } catch (error) {
        console.log('Error in updateRoomCapacityService:', error);
    }
}