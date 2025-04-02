//importing 

import 'dotenv/config'
import express, { NextFunction, Request, Response } from 'express';
import connectDatabase from "./config/database.config"
import { CustomError } from './middleware/errorhandler.middleware';
import path from 'path'


//using routes
import CategoryRoutes from './routes/category.routes'
import ReviewRoutes from './routes/review.routes';
import userRoutes from './routes/user.routes'
import productRoutes from './routes/product.routes';
import cartRoutes from './routes/cart.routes'
import wishlistRoutes from './routes/wishlist.routes'
import orderRoutes from './routes/order.routes'


const app = express()
const DB_URI: string = process.env.DB_URI || ''
const PORT = process.env.PORT || 8000;



connectDatabase(DB_URI)


//using middleware
app.use(express.urlencoded({extended: false }));
app.use(express.json());



//serving static files
app.use('/api/uploads',express.static(path.join(__dirname,'../', 'uploads')))




// using routes
app.use('/api/user/', userRoutes);
app.use('/api/product', productRoutes);
app.use('/api/category', CategoryRoutes);
app.use('/api/review', ReviewRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/order', orderRoutes);

app.use('/',(req:Request, res:Response) => {
    res.status(200).json({message:'server is up & running'});
})

// handle not found path 
app.all('*', (req:Request, res:Response, next:NextFunction) => {

    const message = `can not ${req.method} on ${req.originalUrl}`

    const error = new CustomError(message, 404)
    next(error)

})

//error handeler
app.use((error:any, req:Request, res:Response, next: NextFunction) => {
    const statusCode = error.statusCode || 500
    const status = error.status || 'error'
    const message = error.message || 'something went wrong!'

    res.status(statusCode).json ({
        status: status,
        success: false,
        message: message
    })
})

//fields 

app.listen(PORT, () => console.log(`server is running at http://localhost:${PORT}`))
