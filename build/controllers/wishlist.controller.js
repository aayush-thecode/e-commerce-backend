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
exports.clearWishlist = exports.getWishlist = exports.removeFromWishlist = exports.addToWishlist = void 0;
const asyncHandler_utils_1 = require("../utils/asyncHandler.utils");
const errorhandler_middleware_1 = require("../middleware/errorhandler.middleware");
const product_model_1 = __importDefault(require("../models/product.model"));
const users_model_1 = __importDefault(require("../models/users.model"));
const mongoose_1 = __importDefault(require("mongoose"));
const pagination_utils_1 = require("../utils/pagination.utils");
//add to wishlist 
exports.addToWishlist = (0, asyncHandler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productId = req.body.productId;
    const user = req.user;
    if (!productId) {
        throw new errorhandler_middleware_1.CustomError('Product Id is required', 404);
    }
    const product = yield product_model_1.default.findById(productId);
    if (!product) {
        throw new errorhandler_middleware_1.CustomError('Product not found', 404);
    }
    const userDocument = yield users_model_1.default.findById(user._id);
    if (!userDocument) {
        throw new errorhandler_middleware_1.CustomError('user not found', 404);
    }
    //if product exists already in watchlist
    if (userDocument.wishList.some(item => item.toString() === productId)) {
        throw new errorhandler_middleware_1.CustomError('Product already in wishlist', 400);
    }
    userDocument.wishList.push(new mongoose_1.default.Types.ObjectId(productId));
    yield userDocument.save();
    res.status(201).json({
        status: 'success',
        success: true,
        message: 'Product added to wishlist successfully!',
        data: userDocument.wishList
    });
}));
// Remove product from wisilist
exports.removeFromWishlist = (0, asyncHandler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productId = req.params.productId;
    const user = req.user;
    console.log(req.user);
    if (!productId) {
        throw new errorhandler_middleware_1.CustomError('Product Id is required', 400);
    }
    const userDocument = yield users_model_1.default.findById(user._id);
    if (!userDocument) {
        throw new errorhandler_middleware_1.CustomError('User not found', 404);
    }
    // Check if product exists in wishlist
    if (!userDocument.wishList.some(item => item.toString() === productId)) {
        throw new errorhandler_middleware_1.CustomError('Product not in wishlist', 404);
    }
    // Remove product from wishlist
    userDocument.wishList = userDocument.wishList.filter(item => item.toString() !== productId);
    yield userDocument.save();
    res.status(200).json({
        status: 'success',
        success: true,
        message: 'Product removed from wishlist successfully!',
        updatedWishlist: userDocument.wishList,
    });
}));
// Get user's wishlist
exports.getWishlist = (0, asyncHandler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page } = req.query;
    const currentPage = parseInt(page) || 1;
    const queryLimit = parseInt(limit) || 10;
    const skip = (currentPage - 1) * queryLimit;
    const user = req.user;
    const userDocument = yield users_model_1.default.findById(user._id);
    if (!userDocument) {
        throw new errorhandler_middleware_1.CustomError('User not found', 404);
    }
    const totalCount = userDocument.wishList.length;
    const paginatedWishlist = userDocument.wishList.slice(skip, skip + queryLimit);
    const populatedWishlist = yield product_model_1.default.find({
        _id: { $in: paginatedWishlist },
    })
        .populate('createdBy')
        .populate('category');
    const pagination = (0, pagination_utils_1.getPaginationData)(currentPage, queryLimit, totalCount);
    res.status(200).json({
        status: 'success',
        success: true,
        data: {
            data: populatedWishlist,
            pagination,
        },
        message: 'Wishlist fetched successfully!',
    });
}));
// Clear entire wishlist
exports.clearWishlist = (0, asyncHandler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const userDocument = yield users_model_1.default.findById(user._id);
    if (!userDocument) {
        throw new errorhandler_middleware_1.CustomError('User not found', 404);
    }
    userDocument.wishList = [];
    yield userDocument.save();
    res.status(200).json({
        status: 'success',
        success: true,
        message: 'Wishlist cleared successfully!'
    });
}));
