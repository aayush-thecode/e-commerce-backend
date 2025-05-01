import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.utils";
import { CustomError } from "../middleware/errorhandler.middleware";
import { Cart } from "../models/cart.model";
import Product from "../models/product.model";
// import { getPaginationData } from "../utils/pagination.utils";


export const create = asyncHandler(async (req:Request, res: Response) => {

    const {productId, quantity} = req.body;
    console.log("🚀 ~ create ~ body:", req.body)

    const userId = req.user._id;

    let cart

    if(!userId) {
        throw new CustomError('userID is required', 400)
    }

    if(!productId) {
        throw new CustomError('productID is required', 400)
    }

    cart = await Cart.findOne({user:userId});

    if(!cart) {
        cart = new Cart({user:userId, items: []})
    }

    const product = await Product.findById(productId)

    if(!product) {
        throw new CustomError('product not found', 404)
    }

    const existingProduct = cart.items.find((item) => item.product.toString() === productId)
    console.log("🚀 ~ create ~ existingProduct:", existingProduct)

    if(existingProduct) {
        existingProduct.quantity += Number(quantity)

    }else {

        cart.items.push({product:productId, quantity})
    }


    await cart.save()

    res.status(201).json({
        status: 'success',
        success: true,
        message: 'product added to cart',
        data: cart
    })

});


//get cart by user id 

export const getCartByUserId = asyncHandler(
	async (req: Request, res: Response) => {
		const userId = req.user._id;

		const cart = await Cart.findOne({ user: userId })
			.populate("user", "-password")
			.populate("items.product");

		res.status(200).json({
			status: "success",
			success: true,
			message: "Cart fetched successfully",
			data: cart,
		});
	}
);



// clear cart 

export const clearCart = asyncHandler(async(req:Request, res:Response) => {
    const userId = req.params.userId;

    const cart = await Cart.findOne({user:userId});

    if(!cart) {
        throw new CustomError('cart deos not created yet', 400)
    }

    await Cart.findOneAndDelete({user:userId});

    res.status(200).json ({
        status:'success',
        success:true,
        message:'cart cleared successfully!',
        data: null
    })
}) 


//remove items from cart 

export const removeItemsFromCart = asyncHandler(async(req: Request, res:Response) => {
    const productId = req.params.productId

    if(!productId) {
        throw new CustomError('product not found', 400)
    }

    const userId = req.params._id

    const cart = await Cart.findOne({user: userId})

    if(!cart) {
        throw new CustomError('Cart does not created yet', 400)
    }

    // const newCart  = cart.items.filter((item) => item.product.toString() !== productId)

    cart.items.pull({product:productId}) 

    const updatedCart = await cart.save();

    res.status(200).json({
        success: true,
        status:'success',
        message: "Item removed from cart",
        data: updatedCart

    })
})