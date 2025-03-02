import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.utils";
import { CustomError } from "../middleware/errorhandler.middleware";
import Review from "../models/review.model";



//create review 
export const createReview = asyncHandler(async (req: Request, res: Response) => {

    const body = req.body;

    const review = await Review.create(body)

    res.status(201).json({
        status:'success',
        success:true,
        data: review,
        message: 'review created successfully!'
    })

})

// getall product data 
export const getAllReview = asyncHandler(async (req: Request, res: Response) => {
    const reviews = await Review.find({})

    res.status(200).json ({
        success:true,
        status:'success',
        data: reviews,
        message: 'review fetched successfully!'
    })
})


export const UpdateReview = asyncHandler(async (req: Request, res: Response) => {

    const ReviewId = req.params.id; 
    const {rating, review} = req.body; 

    const reviews = await Review.findByIdAndUpdate(ReviewId, {
        rating, 
        review,
    }, {new:true})

if(!ReviewId) {
    throw new CustomError('review is required', 400)
}

    res.status(201).json ({
    status: 'success',
    success: true,
    message: 'Review Updated successfully',
    data: reviews,

    })

})


//delete productby Id 

export const deleteReviewById = asyncHandler (async(req: Request, res: Response) => {

    const ReviewId = req.params.id;

    const deleteReviewById = await Review.findByIdAndDelete(ReviewId);

    if (!deleteReviewById) {
        throw new CustomError('Review not found', 404)
    }

    res.status(200).json ({
        status: 'success',
        success: true,
        message: 'Review deleted successfully!',
    })
})