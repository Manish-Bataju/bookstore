import express from 'express';
import { addToCart, getCart, deleteCart, removeItemFromCart, updateBookQuantity } from '../controller/cartController.js';
import { protect } from '../middleware/authMiddleware.js';

const cartRouter = express.Router();

cartRouter.use(protect);

//add item to cart
cartRouter.post('/add', protect, addToCart)

//get the user's cart
cartRouter.get('/', protect, getCart)

//remove one specific book from the cart
cartRouter.delete('/remove/:bookId', protect, removeItemFromCart)

//clear the whole cart
cartRouter.delete('/clear', protect, deleteCart)

//update the cartItem
cartRouter.patch('/update-quantity', protect, updateBookQuantity)

export default cartRouter;