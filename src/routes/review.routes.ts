import express from 'express';
import {createReview, deleteReviewById, getAllReview, UpdateReview } from '../controllers/review.controller';


const router = express.Router()

//get all user review
router.get('/', getAllReview);

//create reviews
router.post('/', createReview)

// update review by id
router.put('/:id', UpdateReview)

// delete review by id
router.delete('/:id', deleteReviewById)

export default router; 