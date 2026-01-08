import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
// import * as schema from '../schema/hotelSchema.js'
import { payment, cancelorder } from '../models/paymentModels.js'
import { config } from 'dotenv';
config()

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
})


export const PaymentDB = drizzle(pool, { payment })

export const CancelDB = drizzle(pool, { cancelorder })