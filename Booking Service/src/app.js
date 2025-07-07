import express from 'express'
import { config } from 'dotenv'
import cors from 'cors'
import helmet from 'helmet'
import { InitiallizeBroker } from './services/brokerService.js'
import bookingRouter from './routes/bookingRoutes.js'
config()

const app = express()
const PORT = process.env.PORT || 3003

app.use(cors())
app.use(helmet())


await InitiallizeBroker()
app.get('/', (req, res, next) => {
    try {
        return res.status(200).json({
            sucess: true,
            message: "Server is healthy"
        })
    } catch (error) {
        console.log('Servers is not healthy', error)
    }
})

//all Booking routes
app.use('/api/v1/bookings', bookingRouter)

app.listen(PORT, () => {
    console.log(`Server Started at port ${PORT}`)
})