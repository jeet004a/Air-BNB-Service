import { config } from 'dotenv';
config()
export default {
    schema: './src/schema/hotelSchema.js', // 
    out: './drizzle', // where SQL migration files are stored
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.DATABASE_URL,
    },
};