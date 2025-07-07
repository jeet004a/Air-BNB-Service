import { getAllOrder, adminhotelBookingDetailsService, userHotelBookingDetailsService } from '../services/bookingService.js'
import { adminRoomCheckValidation } from '../utils/apiCalls/adminRoomCheckApiCall.js'



export const allBookingController = async(req, res, next) => {
    try {
        const response = await getAllOrder()
        if (response) {
            return res.status(200).json({
                success: true,
                records: response
            })
        }

        return res.status(400).json({
            success: true,
            message: "something went wrong"
        })

    } catch (error) {
        console.log('error from all booking controller from booking service', error)
    }
}


export const adminhotelBookingDetailsController = async(req, res, next) => {
    try {
        if (!req.admin) {
            return res.status(400).json({
                success: false,
                message: "You are not admin to perform this operation"
            })
        }

        // console.log(req.admin)
        // console.log(req.headers)
        const { hotelId, roomId, userId } = req.params

        const check = await adminRoomCheckValidation({ token: req.headers.authorization, admin_id: req.admin.admin_id, ...req.params })
            // console.log(req.params)

        if (check) {
            const response = await adminhotelBookingDetailsService({ hotelId, roomId, userId })
            if (response) {
                return res.status(200).json({
                    success: true,
                    message: "Admin is validated",
                    data: response
                })
            } else {
                return res.status(400).json({
                    success: true,
                    message: "Something went wrong"
                })
            }
        }

        return res.status(400).json({
            success: true,
            message: "Something went wrong"
        })
    } catch (error) {
        console.log('Error form ', error)
    }
}


export const userHotelBookingDetailsController = async(req, res, next) => {
    try {
        const userRecord = await userHotelBookingDetailsService({ id: req.user.id })
        if (userRecord) {
            return res.status(200).json({
                success: true,
                details: userRecord
            })
        }
        return res.status(404).json({
            success: false,
            message: "Something went wrong or user service is not working"
        })
    } catch (error) {
        console.log('error from user hotel booking contoller from booking service', error)
    }
}