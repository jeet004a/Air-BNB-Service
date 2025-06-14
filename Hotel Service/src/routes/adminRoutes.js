import express from 'express'
import { adminSignUpController, adminSignInController, adminProfileController } from '../controller/adminController.js'
import { adminAuth } from '../middlewares/adminAuth.js'
import { body } from 'express-validator'
const router = express.Router()

router.post('/signup', body('email').isEmail().withMessage('Invalid Email Id'),
    body('password').isLength({ length: 3 }).withMessage('Password must be at least 3 characters long'),
    body('name').isString().isLength({ min: 3 }).withMessage('First Name sould be more than 3 character'),
    adminSignUpController)

router.get('/signin', adminSignInController)

router.get('/profile', adminAuth, adminProfileController)

export default router