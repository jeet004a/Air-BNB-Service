import express from 'express'
import { createHotelContoller, getAllHotelsContoller } from '../controller/hotelController.js'
import { userAuth } from '../middlewares/adminAuth.js'
const router = express.Router()


router.post('/create', userAuth, createHotelContoller)


router.get('/getAllHotels', getAllHotelsContoller)

export default router