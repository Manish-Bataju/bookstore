import express from 'express';
import { addCategory } from '../controller/categoryController.js';
import { protect } from '../middleware/authMiddleware.js';

const categoryRouter = express.Router();

categoryRouter.post('/add', protect, addCategory)


export default categoryRouter;