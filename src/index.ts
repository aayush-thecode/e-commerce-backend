import 'dotenv/config'
import express, { NextFunction, Request, Response } from 'express';
import connectDatabase from "./config/database.config"
import userRoutes from './routes/user.routes'
import { CustomError } from './middleware/errorhandler.middleware';
import productRoutes from './routes/product.routes';
import path from 'path'

const app = express()
const DB_URI: string = process.env.DB_URI || ''
const PORT = process.env.PORT || 8000;

connectDatabase(DB_URI)

//using middleware
app.use(express.urlencoded({extended: false }));
app.use('/api/uploads',express.static(path.join(__dirname,'../', 'uploads')))


// using routes
app.use('/api/user/', userRoutes)
app.use('/api/product', productRoutes)


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
 