import express from 'express';
import {createReview, deleteReview, getAllReview, getReviewId, update,} from '../controllers/review.controller';
import { Authenticate } from '../middleware/authentication.middleware';
import { OnlyAdmin, onlyUser } from '../@types/global.types';

const router = express.Router()

//get all user review
router.get('/', Authenticate(OnlyAdmin), getAllReview);

// get user review by Id
router.get('/:productId', getReviewId)

//create reviews
router.post('/', Authenticate(onlyUser), createReview)

// update review by id
router.put('/:id',Authenticate(onlyUser), update)

// delete review by id
router.delete('/:id', deleteReview)

export default router; 