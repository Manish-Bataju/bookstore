import {v2 as cloudinary} from 'cloudinary';
import { CloudinaryStorage} from 'multer-storage-cloudinary';
import multer from 'multer';

// initial configuration function
const connectCloudinary = async () => {

    try {
        cloudinary.config({
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_SECRET_KEY
    })

     console.log('✅ Cloudinary Configuration Initialized')
    } catch (error) {
        console.error('❌ Cloudinary Config Error:', error)
    }
};

//defining the storage 
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'Bookstore',
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
        transformation: [{ width: 800, height: 800, crop: 'limit'}]
    }
});

//created the Multer Middleware
const upload = multer({storage: storage});


export {connectCloudinary, upload};