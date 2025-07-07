import { bookingService, checkRoomAvailability } from '../services/bookingService.js'
import { manager, hotel, room, bookingDetails } from '../schema/hotelSchema.js'
import { ManagerDB, HotelDB, RoomDB, HotelBookings } from '../DB/dbConnection.js'
import { sql, eq } from 'drizzle-orm'
import moment from 'moment'

export const hotelBookingControllers = async(req, res, next) => {
    try {
        let availability = await checkRoomAvailability(req.body)
        if (availability.success == false) {
            return res.status(404).json({
                status: false,
                availability
            })
        }
        const response = await bookingService({ userId: req.user.id, ...req.body })
        if (response.success == false) {
            return res.status(404).json({
                success: true,
                message: "Something went wrong while booking",
                // response
            })
        }
        // console.log(req.user)
        return res.status(201).json({
            success: true,
            message: "Room Booked sucessfully",
            user: req.user,
            data: response
        })
    } catch (error) {
        console.log('error from hotel booking controller', error)
    }
}


export const hotelAvailabilityController = async(req, res, next) => {
    try {
        const response = await checkRoomAvailability(req.body)

        if (response.success == false) {
            return res.status(404).json({
                status: false,
                response
            })
        }
        return res.status(200).json({
            status: true,
            message: "Fetched room availability successfully",
            response
        })
    } catch (error) {
        console.log('error from hotel Availability Controller', error)
    }
}