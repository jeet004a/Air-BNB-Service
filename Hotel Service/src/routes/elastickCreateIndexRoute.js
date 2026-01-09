import express from 'express'
import { createHotelRoomIndex } from '../elasticSearch/hotelRoomIndexService.js'
const router = express.Router()


router.post('/createIndex', async(req, res, next) => {
    try {
        await createHotelRoomIndex()
        return res.status(200).json({
            success: true,
            msg: "Hello index"

        })
    } catch (error) {
        console.log('Error while creating index', error)
        return res.status(404).json({
            success: false,
            msg: "Something went wrong while creating the index"

        })
    }
})

export default router