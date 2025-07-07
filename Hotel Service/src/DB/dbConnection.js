import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
// import * as schema from '../schema/hotelSchema.js'
import { manager, hotel, room, roomImages, bookingDetails } from '../schema/hotelSchema.js'
import { config } from 'dotenv';
config()

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
})


export const ManagerDB = drizzle(pool, { manager })

export const HotelDB = drizzle(pool, { hotel })

export const RoomDB = drizzle(pool, { room })

export const RoomImagesDB = drizzle(pool, { roomImages })

export const HotelBookings = drizzle(pool, { bookingDetails })