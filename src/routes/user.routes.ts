import express from 'express';
import { register, update } from '../controllers/user.contoller';

const router = express.Router()

//register user
router.post('./', register);

// update user profile
router.put('./:id',update)

export default router; 