"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.update = exports.deleteReview = exports.getReviewId = exports.getAllReview = exports.createReview = void 0;
const asyncHandler_utils_1 = require("../utils/asyncHandler.utils");
const errorhandler_middleware_1 = require("../middleware/errorhandler.middleware");
const review_model_1 = __importDefault(require("../models/review.model"));
const product_model_1 = __importDefault(require("../models/product.model"));
const pagination_utils_1 = require("../utils/pagination.utils");
//create new review 
exports.createReview = (0, asyncHandler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const user = req.user;
    const { productId, rating } = body;
    if (!productId) {
        throw new errorhandler_middleware_1.CustomError('user Id and productId is required', 400);
    }
    const product = yield product_model_1.default.findById(productId);
    if (!product) {
        throw new errorhandler_middleware_1.CustomError('product not found', 404);
    }
    const newReview = yield review_model_1.default.create(Object.assign(Object.assign({}, body), { product: productId, user: user._id }));
    product.reviews.push(newReview._id);
    const totalRating = ((product === null || product === void 0 ? void 0 : product.averageRating) * (product.reviews.length - 1)) + Number(rating);
    product.averageRating = totalRating / product.reviews.length;
    yield product.save();
    res.status(201).json({
        status: 'success',
        success: true,
        data: newReview,
        message: 'review created successfully!'
    });
}));
// getall review data
exports.getAllReview = (0, asyncHandler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { rating, page, limit, query, product } = req.query;
    const currentPage = parseInt(page) || 1;
    const queryLimit = parseInt(limit) || 10;
    const skip = (currentPage - 1) * queryLimit;
    let filter = {};
    if (rating) {
        filter.rating = parseInt(rating);
    }
    if (product) {
        filter.product = product;
    }
    if (query) {
        filter.$or = [
            {
                review: { $regex: query, $options: 'i' },
            }
        ];
    }
    const reviews = yield review_model_1.default.find(filter)
        .skip(skip)
        .limit(queryLimit)
        .sort({ createdAt: -1 })
        .populate('product')
        .populate('user');
    const totalCount = yield review_model_1.default.countDocuments(filter);
    const pagination = (0, pagination_utils_1.getPaginationData)(currentPage, queryLimit, totalCount);
    res.status(200).json({
        success: true,
        status: 'success',
        data: {
            data: reviews,
            pagination,
        },
        message: 'review fetched successfully!'
    });
}));
//get review data by product Id
exports.getReviewId = (0, asyncHandler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId } = req.params;
    if (!productId) {
        throw new errorhandler_middleware_1.CustomError('review data not found', 400);
    }
    const product = yield review_model_1.default.findById(productId);
    if (!product) {
        throw new errorhandler_middleware_1.CustomError("Product not found", 404);
    }
    // Find reviews for the given productId
    const reviews = yield review_model_1.default.find({ product: productId }).populate("user");
    res.status(200).json({
        status: "success",
        success: true,
        count: reviews.length,
        data: reviews,
    });
}));
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
exports.deleteReview = (0, asyncHandler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, productId } = req.body;
    if (!userId || !productId) {
        throw new errorhandler_middleware_1.CustomError("User ID and Product ID are required", 400);
    }
    const product = yield product_model_1.default.findById(productId);
    if (!product) {
        throw new errorhandler_middleware_1.CustomError("Product not found", 404);
    }
    const review = yield review_model_1.default.findOne({ product: productId, user: userId });
    if (!review) {
        throw new errorhandler_middleware_1.CustomError("Review not found or you are not authorized to delete it", 404);
    }
    yield review_model_1.default.findByIdAndDelete(review._id);
    product.reviews.pull(review._id);
    // Recalculate average rating
    if (product.reviews.length === 0) {
        product.averageRating = 0;
    }
    else {
        const totalRating = (product.averageRating * (product.reviews.length + 1)) - review.rating;
        product.averageRating = totalRating / product.reviews.length;
    }
    yield product.save();
    res.status(200).json({
        status: "success",
        success: true,
        message: "Review deleted successfully!",
    });
}));
// update 
exports.update = (0, asyncHandler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { rating, review } = req.body;
    if (typeof rating !== 'number') {
        throw new errorhandler_middleware_1.CustomError('Review must be a number type', 400);
    }
    const id = req.params.id;
    const oldReview = yield review_model_1.default.findById(id);
    if (!oldReview) {
        throw new errorhandler_middleware_1.CustomError('Review not found', 404);
    }
    const product = yield product_model_1.default.findById(review.product);
    if (!product) {
        throw new errorhandler_middleware_1.CustomError('product not found', 404);
    }
    const newRating = Number(product.averageRating) * product.reviews.length - oldReview.rating + Number(rating);
    product.averageRating = newRating / product.reviews.length;
    yield product.save();
    yield review_model_1.default.findByIdAndUpdate(id, { rating, review }, { new: true });
}));
