import { manager, hotel, room } from '../schema/hotelSchema.js'
import { ManagerDB, HotelDB, RoomDB } from '../DB/dbConnection.js'
import { sql } from 'drizzle-orm'

export const createRoomService = async(payload) => {
    try {
        const admin = await RoomDB.execute(sql `select h.* from manager m ,hotel h where m.email=${payload.email} and m.id=h.host_id`)
        payload.hotelId = admin.rows[0].id
            // const response = await RoomDB.insert(room).values(payload).returning()
            // console.log(admin.rows[0])
        if (admin.rows[0].room_capacity > 0) {
            if (payload.roomType === 'single' && payload.max_guests < 3) {
                const response = await RoomDB.insert(room).values(payload).returning()
                await HotelDB.execute(sql `update hotel set room_capacity=room_capacity-1 where id=${admin.rows[0].id}`)
                return 'Room created successfully with id: ' + response[0].id; // Room 
            } else if (payload.roomType === 'double' && payload.max_guests > 2) {
                const response = await RoomDB.insert(room).values(payload).returning()
                await HotelDB.execute(sql `update hotel set room_capacity=room_capacity-1 where id=${admin.rows[0].id}`)
                return 'Room created successfully with id: ' + response[0].id; // Room 
            } else {
                return "Room type or max guests not valid for single room";
            }

        }
        return false // No room capacity left
    } catch (error) {
        console.log('Error in create room service', error);
    }
}




export const getAllRoomsAdminService = async(payload) => {
    try {
        const response = await RoomDB.execute(sql `select room.* from room, hotel,manager  where room.hotel_id=hotel.id and hotel.host_id=manager.id and manager.email=${payload.email}`)

        return response.rows
    } catch (error) {
        console.log('error get all rooms based on admin service', error)
    }
}


export const getAllRoomsService = async() => {
    try {
        //below query for check number of rooms based on rooms
        // const response = await RoomDB.execute(sql `select hotel_id,count(id) from room where 1=1 group by hotel_id`)
        const response = await RoomDB.execute(sql `select * from room`)
        return response.rows
    } catch (error) {
        console.log('error from get all room service', error)
    }
}