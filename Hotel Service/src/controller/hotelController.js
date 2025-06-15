import { ManagerDB, HotelDB } from '../DB/dbConnection.js'
import { manager, hotel } from '../schema/hotelSchema.js'
import { eq, sql } from 'drizzle-orm'
import { createHotelService, updateRoomCapacityService } from '../services/hotelService.js'

export const createHotelContoller = async(req, res, next) => {
    try {
        const existingManager = await ManagerDB.select().from(manager).where(eq(manager.email, req.user.email))
        const existingHotel = await HotelDB.select().from(hotel).where(eq(hotel.hostId, existingManager[0].id))
        if (existingHotel.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Hotel already exists for this manager or this email id',
            })
        }
        // console.log(existingHotel)
        const response = await createHotelService(req, existingManager[0].id)
            // let response = true
        if (response) {
            return res.status(201).json({
                success: true,
                message: 'Hotel created successfully',
                details: response[0]
            })
        }

        return res.status(400).json({
            success: false,
            message: 'Hotel creation failed',
        })
    } catch (error) {
        console.log('Error in createHotelContoller:', error);
    }
}


export const getAllHotelsContoller = async(req, res, next) => {
    try {
        console.log(req.query.limit, req.query.page)
            // const hotels = await HotelDB.select({ count: sql `count(*)` }).from(hotel)
        const hotelCount = await HotelDB.execute(sql `select count(*) from hotel`)
        let prev = (page - 1) * limit
        let next = hotelCount.rows[0].count - (page * limit)

        // const hotelData = await HotelDB.select().from(hotel).limit(limit).offset(prev)
        const hotelData = await HotelDB.execute(sql `select * from hotel limit ${limit} offset ${prev}`)

        return res.status(200).json({
            success: true,
            message: 'All hotels fetched successfully',
            recordCount: hotelCount.rows,
            prevPage: prev > 0 ? prev : 0,
            nextPage: next > 0 ? next : 0,
            details: hotelData.rows
        })
    } catch (error) {
        console.log('Error in getAllHotelsContoller:', error);
    }
}


export const updateRoomCapacityContoller = async(req, res, next) => {
    try {
        const hotelId = req.params.id
        const { roomCapacity } = req.body
        const response = await updateRoomCapacityService({ hotelId, roomCapacity })
        return res.status(200).json({
            success: true,
            message: 'Room capacity updated successfully',
            updateStatus: response
        })

    } catch (error) {
        console.log('Error in updateRoomCapacityContoller:', error);
    }
}