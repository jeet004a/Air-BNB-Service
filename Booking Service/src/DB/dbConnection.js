import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from '../schema/bookingSchema.js'
import { config } from 'dotenv';
config()

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
})


export const bookingDB = drizzle(pool, { schema })