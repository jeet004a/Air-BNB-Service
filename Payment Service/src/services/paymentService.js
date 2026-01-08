import { v4 as uuid } from 'uuid'
import { payment, cancelorder } from '../models/paymentModels.js'
import { PaymentDB, CancelDB } from '../db/dbConnection.js'
import { sql, eq } from 'drizzle-orm'
import { PaymentSuccess } from './brokerService.js'
export const paymentService = async(payload) => {
    try {
        // console.log(payload)
        const existingRecPayment = await PaymentDB.execute(sql `select * from payment where booking_id=${payload.bookingId}`)

        if (existingRecPayment.rows.length > 0) {
            return {
                success: false,
                msg: "This Order Payment is already Successful",
                rec: existingRecPayment.rows
            }
        }
        payload.paymentId = uuid()
        const response = await PaymentDB.insert(payment).values({
                paymentId: payload.paymentId,
                bookingId: payload.bookingId,
                userId: payload.userId,
                hotelId: payload.hotelId,
                roomId: payload.roomId,
                totalPrice: payload.totalPrice,
                paymentStatus: payload.paymentStatus,
            })
            // console.log('xxx')
            // const response = await PaymentDB.execute(sql `select * from payment`)
        if (response.rowCount > 0) {
            await PaymentSuccess({ bookingId: payload.bookingId, paymentStatus: payload.paymentStatus })
            return { success: true, msg: "Payment successfully" }
        }
        return {
            success: false,
            msg: "Something went Wrong",
        }
    } catch (error) {
        console.log('Error from payment service', error)
        return false
    }
}



export const cancelOrderService = async(payload) => {
    try {

        const existingRecPayment = await PaymentDB.execute(sql `select * from payment where booking_id=${payload.bookingId}`)

        if (existingRecPayment.rows.length > 0) {
            return {
                success: false,
                msg: "This Order Payment is already Successful",
                rec: existingRecPayment.rows
            }
        }

        const existingRecCancel = await CancelDB.execute(sql `select * from cancelorder where booking_id=${payload.bookingId}`)
        if (existingRecCancel.rows.length > 0) {
            return {
                success: false,
                msg: "Order is already canceled",
                rec: existingRecCancel.rows
            }
        }
        const response = await CancelDB.insert(cancelorder).values({
                bookingId: payload.bookingId,
                userId: payload.userId,
                hotelId: payload.hotelId,
                roomId: payload.roomId,
                totalPrice: payload.totalPrice,
                paymentStatus: payload.paymentStatus,
            })
            // console.log('xxx')
            // const response = await PaymentDB.execute(sql `select * from payment`)
        if (response.rowCount > 0) {
            await PaymentCancel({ bookingId: payload.bookingId, paymentStatus: payload.paymentStatus })
            return { success: true, msg: "Order Cancel successfully" }
        }
        return {
            success: false,
            msg: "Something went Wrong",
        }
    } catch (error) {
        console.log('Error from cancel order service', error)
        return false
    }
}



export const HandleSubsrciption = (message) => {
    try {
        console.log('Message received by order Kafka consumer', message)
    } catch (error) {
        console.log('error from Handle Subsription service', error)
    }
}