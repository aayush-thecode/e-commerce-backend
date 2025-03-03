import express from 'express';
import { deleteUserById, getAllUserData, getUserDataById, login, register, update } from '../controllers/user.controller';

const router = express.Router()

//register user
router.post('/', register);

// update user profile
router.put('/:id',update)

// login 
router.post('/login',login)

//get all users
router.get('/', getAllUserData)

//get user by id 
router.get('/:id', getUserDataById )

//delete user by id 
router.delete('/:id', deleteUserById)

export default router; 