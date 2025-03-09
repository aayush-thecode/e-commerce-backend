import express from 'express';
import { addToWishlist } from '../controllers/wishlist.controller';
import { Authenticate } from '../middleware/authentication.middleware';
import { onlyUser } from '../@types/global.types';


const router = express.Router();

//add to wishlist 
router.post('/',Authenticate(onlyUser), addToWishlist);

//update to wishlist 
router.put('/:id',Authenticate(onlyUser), )
