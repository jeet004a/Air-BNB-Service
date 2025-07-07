import express from 'express'
import userRoutes from './routes/userRoutes.js'
import cors from 'cors'
const app = express()
import { config } from 'dotenv'
config()
const PORT = process.env.PORT || 3001

app.get('/', (req, res, next) => {
    try {
        return res.status(200).json({
            success: true,
            message: "Server is healthy"
        })
    } catch (error) {
        console.log('error', error)
    }
})
app.use(express.json())
app.use(cors())
app.use('/api/v1', userRoutes)


process.on('uncaughtException', err => {
    console.error('Uncaught Exception:', err);
});

app.listen(PORT, () => {
    console.log(`User Service is running on port ${PORT}`)
})