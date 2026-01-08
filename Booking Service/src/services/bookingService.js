import { bookingDB } from '../DB/dbConnection.js'
import { bookings } from '../schema/bookingSchema.js'
import { sql } from 'drizzle-orm'


//below function to create the order from hotel service using kafka event. For below function no api routes are created
export const createOrderService = async(data) => {
    try {
        data.paymentStatus = 'pending'
        let response = await bookingDB.insert(bookings).values(data).returning()
            // console.log(response)
            // console.log('hello data', data)
    } catch (error) {
        console.log('error from create order booking service', error)
    }
}

//Below function to get all db orders
export const getAllOrder = async() => {
    try {
        const response = await bookingDB.execute(sql `select * from bookings`)
        return response.rows
    } catch (error) {
        console.log('error from getAllorder booking service', error)
    }
}


//Below function returns booking records based on hotelid roomid and userid and only hotel admin have access the below service function
export const adminhotelBookingDetailsService = async(payload) => {
    try {
        // console.log('payload', payload)
        const response = await bookingDB.execute(sql `select * from bookings where "hotelId"=${payload.hotelId} and "roomId"=${payload.roomId} and "userId"=${payload.userId}`)
            // console.log('response', response.rows)
        if (response.rows.length > 0) {
            return response.rows
        }
        return "data is not present with your given paramas"
    } catch (error) {
        console.log('error from ', error)
    }
}





export const userHotelBookingDetailsService = async(payload) => {
    try {
        const response = await bookingDB.execute(sql `select * from bookings where "userId"=${payload.id}`)
        if (response.rows.length > 0) {
            return response.rows
        }
        return false
    } catch (error) {
        console.log('error from user hotel booking details service from booking service', error)
    }

}


//below function is to update the payment status booking db
export const paymentStatusUpdateService = async(payload) => {
    try {
        const rec = await bookingDB.execute(sql `select * from bookings where id=${payload.bookingId}`)
        if (rec.rows[0].payment_status == 'completed') {
            return {
                status: true,
                message: "This order Payment already completed"
            }
        } else {
            const response = await bookingDB.execute(sql `update bookings set payment_status=${payload.paymentStatus} where id=${payload.bookingId}`)
            if (response.rowCount > 0) {
                return {
                    status: true,
                    message: "Payment Completed"
                }
            }
        }

        // const response = await bookingDB.execute(sql `update bookings set payment_status='pending' where id=${payload.bookingId} `)

        return false
    } catch (error) {
        console.log(error)
        return false
    }
}




//below function is handle the kafka subscription - 'create-order'
export const HandleSubsrciption = async(message) => {
    try {
        if (message.event == 'create-order') {
            await createOrderService(message.data)
        } else if (message.event == "payment-completed") {
            await paymentStatusUpdateService({ bookingId: message.data.bookingId, paymentStatus: message.data.paymentStatus })
            console.log('Order Update successfully', message.data.bookingId)
        } else if (message.event == "payment-cancel") {
            await paymentStatusUpdateService({ bookingId: message.data.bookingId, paymentStatus: message.data.paymentStatus })
            console.log('Order Canceled successfully', message.data.bookingId)
        }
        console.log('Message received by order Kafka consumer', message)
    } catch (error) {
        console.log('error from Handle Subsription service', error)
    }
}