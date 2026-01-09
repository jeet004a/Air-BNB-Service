import { ManagerDB, HotelDB } from '../DB/dbConnection.js'
import { manager, hotel } from '../schema/hotelSchema.js'
import { eq, sql } from 'drizzle-orm'
import { createHotelService, updateRoomCapacityService, hotelDetailsByIdService } from '../services/hotelService.js'

export const createHotelContoller = async(req, res, next) => {
    try {
        const existingManager = await ManagerDB.select().from(manager).where(eq(manager.email, req.user.email))
            // const existingHotel = await HotelDB.select().from(hotel).where(eq(hotel.hostId, existingManager[0].id))
        const existingHotel = await HotelDB.execute(sql `select id from hotel where hotel.name=${req.body.title} and hotel.host_id=${req.body.hostId}`)

        if (existingHotel.rows.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Hotel already exists for this manager or this email id',
            })
        }
        // console.log(existingHotel.rows.length)
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
        // console.log(req.query.limit, req.query.page)
        let limit = req.query.limit
        let page = req.query.page
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


export const getHotelByIdController = async(req, res, next) => {
    try {
        const { id } = req.params
        const response = await hotelDetailsByIdService(id)
        if (!response) {
            return res.status(404).json({
                success: false,
                msg: `Hotel is not found with the id ${id}`,
            })
        }
        return res.status(200).json({
            success: true,
            msg: 'Every this is fine',
            response

        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            msg: 'Something went wrong',
            error
        })
    }
}


export const getHotelDetailsBasedOnPageController = async(req, res, next) => {
    try {
        const { page, limit } = req.query
        if (page < 0 && limit < 0) {
            return res.status(400).json({
                success: false,
                msg: "Page or Limit should not less than 0"
            })
        }
        const response = await HotelDB.execute(`select * from hotel where 1=1 LIMIT ${limit} OFFSET ${page}`)
            // console.log(response.rows)
        return res.status(200).json({
            success: true,
            msg: 'Hello from server',
            record: response.rows
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            msg: "Some thing went wrong",
            error
        })
    }
}