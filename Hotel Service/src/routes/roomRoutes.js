import express from 'express'
import { roomController, getAllRoomsAdminControlller, getAllRoomsController } from '../controller/roomController.js'
import { adminAuth } from '../middlewares/adminAuth.js'
const router = express.Router()


router.post('/create', adminAuth, roomController)

router.get('/admin/rooms', adminAuth, getAllRoomsAdminControlller)

router.get('/rooms', getAllRoomsController)

export default router;