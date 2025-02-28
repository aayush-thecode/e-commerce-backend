import express from 'express';
import { create, deleteCategoryById, getAll, UpdateProduct } from '../controllers/category.controller';


const router = express.Router()

//register Category
router.post('/', create);

//update category 
router.put('/:id', UpdateProduct),

// delete by id 
router.delete('/:id',deleteCategoryById )

// get all categories
router.get('/', getAll)

export default router; 