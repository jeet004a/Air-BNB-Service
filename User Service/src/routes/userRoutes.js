import express from 'express';
import { signUpController, signInController, userProfile } from '../controllers/userController.js'
import { body } from 'express-validator'
import { userAuth } from '../middlewares/userAuth.js'
const router = express.Router()


router.post('/auth/signup',
    // body('email').isEmail().withMessage('Invalid Email Id'),
    body('password').isLength({ length: 3 }).withMessage('Password must be at least 6 characters long'),
    body('firstname').isString().isLength({ min: 3 }).withMessage('First Name sould be more than 3 character'),
    body('lastname').isString().isLength({ min: 3 }).withMessage('First Name sould be more than 3 character'),
    signUpController)

router.get('/auth/signin', body('email').isEmail().withMessage('Invalid Email Id'),
    body('password').isLength({ length: 3 }).withMessage('Password must be at least 6 characters long'),
    signInController)

router.get('/auth/profile', userAuth, userProfile)

export default router