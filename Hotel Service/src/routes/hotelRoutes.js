import express from 'express'
import { createHotelContoller, getAllHotelsContoller, updateRoomCapacityContoller, getHotelByIdController, getHotelDetailsBasedOnPageController } from '../controller/hotelController.js'
import { adminAuth } from '../middlewares/adminAuth.js'
const router = express.Router()


router.post('/create', adminAuth, createHotelContoller)

router.patch('/update/:id', adminAuth, updateRoomCapacityContoller)

router.get('/getAllHotels', getAllHotelsContoller)

router.get('/hotel/:id', getHotelByIdController)

router.get('/record', getHotelDetailsBasedOnPageController)

export default router