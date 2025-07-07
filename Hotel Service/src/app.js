import express from 'express'
import { config } from 'dotenv'
import adminRoutes from './routes/adminRoutes.js'
import hotelRoutes from './routes/hotelRoutes.js'
import roomRoutes from './routes/roomRoutes.js'
import bookingRoutes from './routes/bookingRoutes.js'
import { InitiallizeBroker } from './services/brokerService.js'
import { createHotelRoomIndex } from './elasticSearch/hotelRoomIndexService.js'
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

//Kafka initialization
await InitiallizeBroker()

//admin routes
app.use('/api/v1/admin', adminRoutes)

//Admin hotel routes
app.use('/api/v1/hotel', hotelRoutes)

//Hotel room routers
app.use('/api/v1/room', roomRoutes)

//Booking Routes
app.use('/api/v1/bookings', bookingRoutes)


app.get('/', (req, res) => {
    res.setHeader('X-Powered-By', 'Express'); // ✅ OK here
    res.json({ message: 'healthy' });
});


//Elastic Search Controller
// (async() => {
//     try {
//         // console.log('hello')
//         await createHotelRoomIndex();
//         console.log('✅ Elasticsearch hotel index ready');
//     } catch (err) {
//         console.error('❌ Failed to create ES index:', err);
//     }
// })();

app.listen(PORT, () => {
    console.log(`Search Service is running on port ${PORT}`)
})