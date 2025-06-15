import express from 'express'
import userRoutes from './routes/userRoutes.js'
import cors from 'cors'
const app = express()


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


app.listen(3001, () => {
    console.log('User Service is running on port 3001')
})