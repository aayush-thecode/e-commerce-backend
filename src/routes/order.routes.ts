import express from 'express'
import { Authenticate } from '../middleware/authentication.middleware';
import { OnlyAdmin, onlyUser } from '../@types/global.types';
import { cancelOrder, deleteOrder, getAllOrder, getByUserId, placeOrder, updateOrderStatus } from '../controllers/order.controller';


const router = express.Router();

//place new order
router.post('/place', Authenticate(onlyUser), placeOrder);

// get all order
router.get('/', Authenticate(OnlyAdmin), getAllOrder);

//get order by userId 
router.get('/user',Authenticate(OnlyAdmin), getByUserId);

//update order status 
router.put('/:id/status', Authenticate(OnlyAdmin), updateOrderStatus);

//delete an order
router.delete('/:id', deleteOrder);

//cancel and order 
router.put('/:orderId/cancel/:productId?', Authenticate(onlyUser), cancelOrder);


export default router; 