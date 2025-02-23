import 'dotenv/config'
import express from 'express';
import connectDatabase from "./config/database.config"
import userRoutes from './routes/user.routes'

const app = express()
const DB_URI: string = process.env.DB_URI || ''
const PORT = process.env.PORT || 8000;

connectDatabase(DB_URI)

// using routes
app.use('/api/v1/user', userRoutes)

app.listen(PORT, () => console.log(`server is running at http://localhost:${PORT}`))
 