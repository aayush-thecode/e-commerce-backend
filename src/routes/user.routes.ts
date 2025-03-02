import express from 'express';
import { getAllData, login, register, update } from '../controllers/user.controller';

const router = express.Router()

//register user
router.post('/', register);

// update user profile
router.put('/:id',update)

// 
router.post('/login',login)

//get all users
router.get('/',getAllData)

export default router; 