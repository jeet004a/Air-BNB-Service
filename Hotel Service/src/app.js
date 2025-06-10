import express from 'express'
import { config } from 'dotenv'
import adminRoutes from './routes/adminRoutes.js'
import hotelRoutes from './routes/hotelRoutes.js'
config()
const PORT = process.env.PORT || 3002
const app = express()


app.get('/', (req, res, next) => {
    try {
        return res.status(200).json({
            success: true,
            message: 'Search Service is healthy',
        })
    } catch (error) {
        console.log('Error in Search Service:', error)
    }
})

app.use(express.json())

//admin routes
app.use('/api/v1/admin', adminRoutes)

//Admin routes
app.use('/api/v1/hotel', hotelRoutes)

app.listen(PORT, () => {
    console.log(`Search Service is running on port ${PORT}`)
})