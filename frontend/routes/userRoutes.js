import express from 'express';
const userRouter = express.Router();

import {userLogin, userRegistration, adminLogin} from  '../controller/userController.js'
import {validateRequest} from '../middleware/validator.js';
import {userJoiSchema} from '../validations/userValidations.js'
import {protect} from '../middleware/authMiddleware.js'

userRouter.post('/register', userRegistration);
userRouter.post('/login', userLogin)
userRouter.post('/admin', adminLogin)

// protected routes
// userRouter.get('profile', protect, validateRequest(userJoiSchema), getUserProfile)
// userRouter.put('/profile', protect, validateRequest(userJoiSchema), updateUserProfile)

export default userRouter; 