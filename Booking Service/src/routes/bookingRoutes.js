import express from 'express'
import { allBookingController, adminhotelBookingDetailsController, userHotelBookingDetailsController } from '../controllers/bookingControllers.js'
import { adminAuth } from '../middlewares/adminAuth.js'
import { userAuth } from '../middlewares/userAuth.js'
const router = express.Router()

router.get('/allBookings', allBookingController)

//access only for hotel admin
router.get('/details/:hotelId/:roomId/:userId', adminAuth, adminhotelBookingDetailsController)

//access only loggedin user
router.get('/user/:userId', userAuth, userHotelBookingDetailsController)

export default router