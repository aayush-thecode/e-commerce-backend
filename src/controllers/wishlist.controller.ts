import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.utils';
import { CustomError } from '../middleware/errorhandler.middleware';
import Product from '../models/product.model';
import User from '../models/users.model';



export const addToWishlist = asyncHandler(async(req: Request, res:Response) => {

    const productId = req.params.id; 

    const user = req.user;

    if(!productId) {
        throw new CustomError('Product Id is required', 404)
    }

    const product = await Product.findById(productId);

    if(!product) {
        throw new CustomError('Product not found', 404);
    }

    const userDocument = await User.findById(user._id)

    if(!userDocument) {
        throw new CustomError('user not found',404);
    }

                //if product exists already in watchlist

    if(userDocument.wishList.includes(product: productId))
})