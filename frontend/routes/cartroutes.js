import express from 'express';
import { addToCart, getCart, deleteCart, removeItemFromCart, updateBookQuantity } from '../controller/cartController.js';
import { protect } from '../middleware/authMiddleware.js';

const cartRouter = express.Router();

cartRouter.use(protect);

//add item to cart
cartRouter.post('/add', addToCart)

//get the user's cart
cartRouter.get('/', getCart)

//remove one specific book from the cart
cartRouter.delete('/remove/:bookId', removeItemFromCart)

//clear the whole cart
cartRouter.delete('/clear', deleteCart)

//update the cartItem
cartRouter.patch('/update-quantity', updateBookQuantity)

export default cartRouter;