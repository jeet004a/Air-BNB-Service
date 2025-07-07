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


//below function is handle the kafka subscription - 'create-order'
export const HandleSubsrciption = async(message) => {
    try {
        if (message.event == 'create-order') {
            await createOrderService(message.data)
        }
        console.log('Message received by order Kafka consumer', message)
    } catch (error) {
        console.log('error from Handle Subsription service', error)
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