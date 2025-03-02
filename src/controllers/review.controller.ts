import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.utils";
// import { CustomError } from "../middleware/errorhandler.middleware";
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
    const reviews = await Review.find({}).populate('createdBy')

    res.status(200).json ({
        success:true,
        status:'success',
        data: reviews,
        message: 'reviews fetched successfully!'
    })
})

