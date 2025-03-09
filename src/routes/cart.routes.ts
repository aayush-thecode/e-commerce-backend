import express from 'express'
import { Authenticate } from '../middleware/authentication.middleware'
import { clearCart, create, getCartByUserId, removeItemsFromCart } from '../controllers/cart.controller'
import { onlyUser } from '../@types/global.types'

const router = express.Router()

//add to crate
router.post('/add', Authenticate(onlyUser), create)

// clear route 
router.delete('/clear', Authenticate(onlyUser), clearCart);

//get all 
router.get('/:userId', Authenticate(onlyUser), getCartByUserId);

//remove product from cart 
router.get('/remove/:id',Authenticate(onlyUser), removeItemsFromCart);

export default router;