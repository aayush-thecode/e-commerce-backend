import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.utils";
import { CustomError } from "../middleware/errorhandler.middleware";
import Review from "../models/review.model";
import Product from "../models/product.model";



//create new review 

export const createReview = asyncHandler(async (req: Request, res: Response) => {

    const body = req.body;

    const{userId, productId, rating} = body



    if(!userId || !productId) {
        throw new CustomError('user Id and productId is required',400);
    }


    const product = await Product.findById(productId)

    if(!product) {
        throw new CustomError('product not found', 404)
    }

    const newReview = await Review.create({...body, product: productId, user:userId})
    
    product.reviews.push(newReview._id)
    
    const totalRating:number = ( product?.averageRating as number * (product.reviews.length - 1)) + Number(rating);

    product.averageRating = totalRating / product.reviews.length 

    await product.save()

    res.status(201).json({
        status:'success',
        success:true,
        data: newReview,
        message: 'review created successfully!'
    })

})

// getall review data

export const getAllReview = asyncHandler(async (req: Request, res: Response) => {
    
    const reviews = await Review.find({})

    res.status(200).json ({
        success:true,
        status:'success',
        data: reviews,
        message: 'review fetched successfully!'
    })
})

// update review by id 

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