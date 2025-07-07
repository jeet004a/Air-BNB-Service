import express from 'express'
import { hotelBookingControllers, hotelAvailabilityController } from '../controller/bookingController.js'
import { userValidation } from '../middlewares/userValidationAuth.js'
const router = express.Router()


router.post('/bookings', userValidation, hotelBookingControllers)

router.get('/availability', hotelAvailabilityController)

export default router