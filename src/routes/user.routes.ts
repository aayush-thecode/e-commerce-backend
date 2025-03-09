import express from 'express';
import { deleteUserById, getAllUserData, getUserDataById, login, register, update } from '../controllers/user.controller';
import { Authenticate } from '../middleware/authentication.middleware';
import { allUser, OnlyAdmin, onlyUser } from '../@types/global.types';

const router = express.Router()

//register user
router.post('/', register);

// update user profile
router.put('/:id', Authenticate(onlyUser), update)

// login 
router.post('/login',login)

//get all users
router.get('/',Authenticate(OnlyAdmin), getAllUserData)

//get user by id 
router.get('/:id',Authenticate(OnlyAdmin) ,getUserDataById )

//delete user by id 
router.delete('/:id',Authenticate(OnlyAdmin) ,deleteUserById)

export default router; 