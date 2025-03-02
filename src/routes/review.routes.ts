import express from 'express';
import {createReview, getAllReview } from '../controllers/review.controller';


const router = express.Router()

//register user
router.get('/', getAllReview);

//create reviews
router.post('/', createReview)

export default router; 