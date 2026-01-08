import express from 'express'
import cors from 'cors'
import { config } from 'dotenv'
config()
import paymentRoutes from './routes/paymentRoutes.js'
import { InitiallizeBroker } from './services/brokerService.js'
const app = express()
const PORT = process.env.PORT

app.use(express.json())
app.use(cors())
app.use('/api/v1/', paymentRoutes)

await InitiallizeBroker()

app.get('/', (req, res, next) => {
    try {
        return res.status(200).json({
            success: true,
            message: "Server is healthy"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server is not helthy",
            error
        })
    }
})

app.listen(PORT, () => {
    console.log(`Server started at ${PORT}`)
})