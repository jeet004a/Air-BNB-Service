import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './userSchema.js'
import { config } from 'dotenv';
config()

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
})


export const userDB = drizzle(pool, { schema })