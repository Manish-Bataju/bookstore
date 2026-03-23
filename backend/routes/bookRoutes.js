import express from 'express';
import {addBook, getAllBooks, getBookById, updateBook, deleteBook} from '../controller/bookController.js';
import {protect, admin} from '../middleware/authMiddleware.js';
import { upload } from '../config/cloudinary.js';
import { validateRequest } from '../middleware/validator.js';
import { bookJoiSchema, updateBookJoiSchema } from '../validations/bookValidations.js';


const bookRouter = express.Router();

//public any one can see or search all books
bookRouter.get('/', getAllBooks);
bookRouter.get('/:id', getBookById);

//admin access only
bookRouter.post('/add', protect, admin, upload.array('bookImage', 5), validateRequest(bookJoiSchema), addBook);
bookRouter.put('/update/:id', protect, admin, upload.array('bookImage', 5),
(req, _, next) =>{
    if(req.files && req.files.length >0){
        req.body.bookImage = req.files.map(file => file.path);
    }
    next();
},
validateRequest(updateBookJoiSchema),
updateBook);
bookRouter.delete('/delete/:id', protect, admin, deleteBook);

export default bookRouter
