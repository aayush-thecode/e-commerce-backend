import express from 'express';
import { create, deleteCategoryById, getAllCategory, getCategoryById, UpdateProduct } from '../controllers/category.controller';


const router = express.Router()

//register Category
router.post('/', create);

//update category 
router.put('/:id', UpdateProduct);

// delete by id 
router.delete('/:id',deleteCategoryById );

// get all categories
router.get('/', getAllCategory);

//get category by id 
router.get('/', getCategoryById);

export default router; 