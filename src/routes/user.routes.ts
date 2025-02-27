import express from 'express';
import { getAllData, login, register, update } from '../controllers/user.contoller';

const router = express.Router()

//register user
router.post('/', register);

// update user profile
router.put('/:id',update)

// 
router.post('/login',login)

//get all users
router.get('/',getAllData)
console.log("🚀 ~ getAllData:", getAllData)

export default router; 