import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.utils";
import { CustomError } from "../middleware/errorhandler.middleware";
import Review from "../models/review.model";
import Product from "../models/product.model";



//create new review 

export const createReview = asyncHandler(async (req: Request, res: Response) => {

    const body = req.body;
    const user = req.user


    const{productId, rating} = body


    if(!productId) {
        throw new CustomError('user Id and productId is required',400);
    }


    const product = await Product.findById(productId)

    if(!product) {
        throw new CustomError('product not found', 404)
    }

    const newReview = await Review.create({...body, product: productId, user:user._id})
    
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

//get review data by product Id

export const getReviewId = asyncHandler(async (req: Request, res: Response) => {

    const {productId }= req.params

    if(!productId) {
        
        throw new CustomError('review data not found', 400); 

    }

    const product = await Review.findById(productId)

    if (!product) {

        throw new CustomError("Product not found", 404);
    }

    // Find reviews for the given productId

    const reviews = await Review.find({ product: productId }).populate("user")

    res.status(200).json({
        status: "success",
        success: true,
        count: reviews.length,
        data: reviews,
    });
});


// update review by id 

// export const updateReview = asyncHandler(async (req: Request, res: Response) => {

//     const { productId, reviewId, rating, review } = req.body

//     if (!productId || !reviewId) {

//         throw new CustomError("Product ID and Review ID are required", 400)

//     }

//     const product = await Product.findById(productId);

//     if (!product) {

//         throw new CustomError("Product not found", 404)

//     }

//     const review = await Review.findById(reviewId)

//     if (!review) {

//         throw new CustomError("Review not found", 404)

//     }

//     // Store the old rating before updating

//     const oldRating = review.rating;

//     // Update review fields

//     if (rating !== undefined) review.rating = rating

//     if (review !== undefined) review.review = review
//     await review.save();

//     // Update the average rating

//     const totalRating = (product?.averageRating as number * product.reviews.length - oldRating + rating) / product.reviews.length

//     product.averageRating = totalRating

//     await product.save();

//     res.status(200).json({
//         status: "success",
//         success: true,
//         data: review,
//         message: "Review updated successfully!",
//     });
// });



//delete reviews by product Id 

export const deleteReview = asyncHandler(async (req: Request, res: Response) => {

    const { userId, productId } = req.body;

    if (!userId || !productId) {

        throw new CustomError("User ID and Product ID are required", 400);
    }

    const product = await Product.findById(productId);

    if (!product) {

        throw new CustomError("Product not found", 404);

    }

    const review = await Review.findOne({ product: productId, user: userId });

    if (!review) {

        throw new CustomError("Review not found or you are not authorized to delete it", 404);
        
    }

    await Review.findByIdAndDelete(review._id);

    product.reviews.pull(review._id) 

    // Recalculate average rating

    if (product.reviews.length === 0) {

        product.averageRating = 0;

    } else {

        const totalRating = (product.averageRating as number * (product.reviews.length + 1)) - review.rating;

        product.averageRating = totalRating / product.reviews.length;

    }

    await product.save();

    res.status(200).json({
        status: "success",
        success: true,
        message: "Review deleted successfully!",
    });
});


// update 

export const update = asyncHandler(async (req:Request, res:Response) => {

    const { rating, review } = req.body;
    if (typeof rating !== 'number') {

        throw new CustomError('Review must be a number type', 400);
    }
    const id = req.params.id;

    const oldReview = await Review.findById(id);

    if(!oldReview) {
        throw new CustomError('Review not found', 404);
    }

    const product = await Product.findById(review.product);

    if(!product) {
        throw new CustomError('product not found', 404);
    }
    const newRating = Number(product.averageRating) * product.reviews.length - oldReview.rating + Number(rating)

    product.averageRating = newRating / product.reviews.length

    await product.save()

    await Review.findByIdAndUpdate(id, {rating, review},{new:true})

})