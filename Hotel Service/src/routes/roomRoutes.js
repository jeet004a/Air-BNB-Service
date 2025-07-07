import express from 'express'
import { roomController, getAllRoomsAdminControlller, getAllRoomsController, adminRoomValidationController, elasticSearchController } from '../controller/roomController.js'
import { adminAuth } from '../middlewares/adminAuth.js'
const router = express.Router()


router.post('/create', adminAuth, roomController)

router.get('/admin/rooms', adminAuth, getAllRoomsAdminControlller)

router.get('/rooms', getAllRoomsController)

//Below routes only for booking service call
router.get('/admin/rooms/validation', adminAuth, adminRoomValidationController)

router.get('/hotel-room/search', elasticSearchController)

export default router;