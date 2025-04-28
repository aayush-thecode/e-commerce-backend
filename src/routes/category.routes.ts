import express from 'express';
import { create, deleteCategoryById, getAllCategory, getCategoryById, UpdateProduct } from '../controllers/category.controller';
import { OnlyAdmin } from '../@types/global.types';
import { Authenticate } from '../middleware/authentication.middleware';


const router = express.Router()

// private routes
//register Category
router.post('/category/', Authenticate(OnlyAdmin),create);

//update category 
router.put('/category/:id',Authenticate(OnlyAdmin), UpdateProduct);

// delete by id 
router.delete('/category/:id',Authenticate(OnlyAdmin), deleteCategoryById);


//public routes 
// get all categories
router.get('/category/', getAllCategory);

//get category by id 
router.get('/category/:id', getCategoryById);

export default router; 