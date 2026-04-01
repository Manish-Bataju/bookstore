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

const autoParseJSON = (req, res, next) => {
  try {
    for (const key in req.body) {
      const value = req.body[key];
      // If the value looks like a JSON string (starts with { or [), parse it
      if (typeof value === 'string' && (value.startsWith('{') || value.startsWith('['))) {
        req.body[key] = JSON.parse(value);
      }
    }
    next();
  } catch (error) {
    return res.status(400).json({ 
      success: false, 
      message: `Error parsing JSON in field: ${key}` 
    });
  }
};

//admin access only
bookRouter.post('/add', protect, admin, upload.fields([{ name: 'coverImage' }, { name: 'gallery' }]), autoParseJSON , validateRequest(bookJoiSchema), addBook);
bookRouter.put('/update/:id', protect, admin, upload.array('bookImage', 5),
(req, _, next) =>{
    if(req.files && req.files.length >0){
        req.body.bookImage = req.files.map(file => file.path);

        req.body.bookImage = {
            coverImage: filePaths[0],
            gallery: filePaths.slice(1)
        };
    }
    next();
},
validateRequest(updateBookJoiSchema),
updateBook);
bookRouter.delete('/delete/:id', protect, admin, deleteBook);

export default bookRouter
