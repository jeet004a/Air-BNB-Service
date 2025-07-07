import { manager, hotel, room, bookingDetails } from '../schema/hotelSchema.js'
import { ManagerDB, HotelDB, RoomDB, HotelBookings } from '../DB/dbConnection.js'
import { SendCreateOrderMessage } from './brokerService.js'
import { sql, eq } from 'drizzle-orm'
import omit from 'lodash';
import moment from 'moment'


export const bookingService = async(payload) => {
    try {
        const raw = moment(new Date());
        const todayDate = moment(raw.format('DD-MM-YYYY'), 'DD-MM-YYYY', true);

        payload.checkIn = moment(payload.checkIn, 'DD-MM-YYYY', true)
        payload.checkOut = moment(payload.checkOut, 'DD-MM-YYYY', true)
        if (payload.checkIn > todayDate && payload.checkOut > todayDate) {
            let numberOfDays = payload.checkOut.diff(payload.checkIn, 'days')
            let price = await RoomDB.execute(sql `select ppn from room where id=${payload.roomId}`)


            let response = await HotelBookings.insert(bookingDetails).values(payload).returning()
            response[0].totalPrice = price.rows[0].ppn * numberOfDays
            let { createdAt, updatedAt, ...filteredData } = response[0]
            await SendCreateOrderMessage(filteredData)
            return { success: true, filteredData } //response
            // console.log(payload)
        }
        return { success: false, message: "please check your check in or check out date and please make sure date should be bigger than today's date" }
    } catch (error) {
        console.log('error is from hotel booking service ', error)
    }
}

//Below function Not in use 
// export const checkRoomAvailability = async(payload) => {
//     try {
//         let success = true
//         let message = ""
//         const raw = moment(new Date());
//         const todayDate = moment(raw.format('DD-MM-YYYY'), 'DD-MM-YYYY', true)
//         const { hotelId, roomId, checkIn, checkOut } = payload
//         const response = await HotelBookings.execute(sql `select * from booking_details where booking_details.hotel_id=${payload.hotelId} and booking_details.room_id=${payload.roomId}`)

//         payload.checkIn = moment(payload.checkIn, 'DD-MM-YYYY', true)
//         payload.checkOut = moment(payload.checkOut, 'DD-MM-YYYY', true)
//         if (payload.checkIn < todayDate) {
//             message = message + "Invalide date"
//             return { success, message }
//         }
//         let i = 0
//         while (i < response.rows.length) {
//             response.rows[i].check_in = moment(response.rows[i].check_in, 'YYYY-MM-DD', true)
//             response.rows[i].check_out = moment(response.rows[i].check_out, 'YYYY-MM-DD', true)
//             if (payload.checkIn > response.rows[0].check_in && payload.checkIn < response.rows[0].check_out) {
//                 console.log(response.rows[0].check_in)
//                 message = message + "Please enter correct date range"
//                 break
//             }
//             i++

//         }
//         console.log(message)

//         // if (payload.checkIn < todayDate) {
//         //     console.log('no')
//         // } else if ((payload.checkIn > response.rows[0].check_in && payload.checkIn < response.rows[0].check_out)) {
//         //     console.log('No')
//         // } else {
//         //     console.log('yes')
//         // }
//     } catch (error) {
//         console.log('error from booking service check room availibality', error)
//     }
// }

export const checkRoomAvailability = async(payload) => {
    try {
        let success = true;
        let message = "";

        const todayDate = moment().startOf('day'); // removes time part
        const { hotelId, roomId, checkIn, checkOut } = payload;

        // Parse and validate check-in/check-out
        const userCheckIn = moment(checkIn, 'DD-MM-YYYY', true);
        const userCheckOut = moment(checkOut, 'DD-MM-YYYY', true);

        if (!userCheckIn.isValid() || !userCheckOut.isValid()) {
            return { success: false, message: "Invalid date format" };
        }

        if (!userCheckOut.isAfter(userCheckIn)) {
            return { success: false, message: "Check-out must be after check-in" };
        }

        if (userCheckIn.isBefore(todayDate)) {
            // console.log('Check-in cannot be in the past')
            return { success: false, message: "Check-in cannot be in the past" };
        }

        const formattedCheckIn = userCheckIn.format('YYYY-MM-DD');
        const formattedCheckOut = userCheckOut.format('YYYY-MM-DD');

        const HotelAndRoomValidation = await RoomDB.execute(sql `select * from room where hotel_id = ${hotelId}
                    AND id = ${roomId}`)
            // console.log('abc', HotelAndRoomValidation.rows)
        if (HotelAndRoomValidation.rows.length === 0) {
            return {
                success: false,
                message: `Room ID ${roomId} does not belong to Hotel ID ${hotelId}`
            };
        }

        const response = await HotelBookings.execute(sql `
            SELECT * FROM booking_details
                WHERE hotel_id = ${hotelId}
                    AND room_id = ${roomId}
                    AND NOT (
                    check_out < ${formattedCheckIn}
                    OR check_in > ${formattedCheckOut}
                    )
            `)

        if (response.rows.length > 0) {
            return {
                success: false,
                message: "Room is already booked for the selected date range"
            };
        }

        return { success: true, message: "Room is available" };
    } catch (error) {
        console.log('Error in booking service checkRoomAvailability:', error);
        return { success: false, message: "Internal server error" };
    }
}




export const HandleSubsrciption = async(message) => {
    try {
        console.log('Message received by order Kafka consumer', message)
    } catch (error) {
        console.log('error from Handle Subsription service', error)
    }
}