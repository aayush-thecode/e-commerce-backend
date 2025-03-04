import express from 'express';
import {createReview, deleteReviewById, getAllReview, getReviewId, UpdateReview } from '../controllers/review.controller';
import { Authenticate } from '../middleware/authentication.middleware';

const router = express.Router()

//get all user review
router.get('/', getAllReview);

// get user review by Id
router.get('/:id', getReviewId)

//create reviews
router.post('/', Authenticate(), createReview)

// update review by id
router.put('/:id', UpdateReview)

// delete review by id
router.delete('/:id', deleteReviewById)

export default router; 