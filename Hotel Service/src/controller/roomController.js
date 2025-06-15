import { createRoomService, getAllRoomsAdminService, getAllRoomsService } from '../services/roomService.js'


export const roomController = async(req, res, next) => {
    try {
        const { email } = req.user

        const response = await createRoomService({...req.body, email })
        console.log(response)
        if (!response) {
            return res.status(400).json({
                success: false,
                message: 'No room capacity left or room creation failed',
            })
        }
        return res.status(201).json({
            success: true,
            message: response,
        })

    } catch (error) {
        console.log('Error in create room router', error)
    }
}

export const getAllRoomsAdminControlller = async(req, res, next) => {
    try {
        const response = await getAllRoomsAdminService(req.user)
        return res.status(200).json({
            success: true,
            message: "fetched successfully",
            response
        })
    } catch (error) {
        console.log('Error in get all admin room router', error)
    }
}


export const getAllRoomsController = async(req, res, next) => {
    try {
        const response = await getAllRoomsService()
        return res.status(200).json({
            success: true,
            message: "All rooms fetched successfully",
            response
        })
    } catch (error) {
        console.log('error get all rooms controller', error)
    }
}