import express from 'express'
import { mainPaymentController, cancelOrderController } from '../controllers/paymentController.js'

const router = express.Router()

router.post('/payment', mainPaymentController)

router.post('/cancel', cancelOrderController)

export default router