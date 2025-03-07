import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.utils";
import { CustomError } from "../middleware/errorhandler.middleware";
import { Cart } from "../models/cart.model";
import Product from "../models/product.model";


export const create = asyncHandler(async (req:Request, res: Response) => {

    const {userId, productId, quantity} = req.body;

    let cart

    if(!userId) {
        throw new CustomError('userID is required', 400)
    }

    if(!productId) {
        throw new CustomError('productID is required', 400)
    }

    cart = await Cart.findOne({user:userId});

    if(!cart) {
        cart = new Cart({user:userId, items:[]})
    }

    const product = await Product.findById(productId)

    if(!product) {
        throw new CustomError('product not found', 404)
    }

    cart.items.push({product:productId, quantity})

    await cart.save()

    res.status(201).json({
        status: 'success',
        success: true,
        message: 'product added to cart'
    })

});