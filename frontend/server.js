
import express from  'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/mongodb.js';
import {connectCloudinary} from './config/cloudinary.js';
import userRouter from './routes/userRoutes.js';
import cartRouter from './routes/cartroutes.js';
import bookRouter from './routes/bookRoutes.js';
import categoryRouter from './routes/categoryRoutes.js';
import orderRouter from './routes/orderRoutes.js';
dotenv.config(); // this loads the variables from .env into process.env

const app = express()

await connectDB()
await connectCloudinary() 
const port = process.env.PORT

//middleware

app.use(express.json())
app.use(cors())


//api endpoints
app.use('/api/user', userRouter)
app.use('/api/cart', cartRouter)
app.use('/api/book', bookRouter)
app.use('/api/category', categoryRouter)
app.use('/api/order', orderRouter)

app.get('/', (req, res) =>{
    res.send('API is Working')
})

app.listen(port, () => console.log('Server started at Port:' + port))