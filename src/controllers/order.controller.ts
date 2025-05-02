import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.utils";
import { Cart } from "../models/cart.model";
import { CustomError } from "../middleware/errorhandler.middleware";
import Product from "../models/product.model";
import Order from "../models/order.model";
import { sendOrderConfirmationEmail } from "../utils/orderconfirmationEmail.utils";
import { getPaginationData } from "../utils/pagination.utils";



//place order 

export const placeOrder = asyncHandler(async(req: Request, res: Response) => {
    
    const userId = req.user._id;

    const cart = await Cart.findOne({user: userId}).populate('items.product');

    if(!cart) {
        throw new CustomError('Cart not found',404)
    }

    const products = await Promise.all(cart.items.map(async(item) => {

        const product = await Product.findById(item.product)

        if(!product) {
            throw new CustomError('Product not found', 404)
        }

            return {
            product: item.product._id,
            quantity: item.quantity,
            totalPrice: Number(product.price) * item.quantity
        }
    }))

    const totalAmount = products.reduce((acc, item) => acc + item.totalPrice, 0)

    const order = new Order({
        user: userId,
        items: products,
        totalAmount
    });

 

    const newOrder = await order.save();
    const populatedOrder = await Order.findById(newOrder._id).populate("items.product")

    if(!populatedOrder) {
        throw new CustomError('order not created', 404);
    }

    await sendOrderConfirmationEmail({
        to: req.user.email,
        orderDetails: populatedOrder
    });

    await Cart.findByIdAndDelete(cart._id)

    res.status(201).json({
        status: 'success',
        success: true,
        message: 'order placed successfully!',
        data: populatedOrder
    })
})


//get all orders

export const getAllOrder = asyncHandler(async (req: Request, res: Response) => {
	const { limit, page, status, query, minTotal, maxTotal, toDate, fromDate } =
		req.query;
	let filter: Record<string, any> = {};

	const currentPage = parseInt(page as string) || 1;
	const perPage = parseInt(limit as string) || 10;
	const skip = (currentPage - 1) * perPage;

	if (query) {
		filter.orderId = { $regex: query, $options: "i" };
	}

	if (status) {
		filter.status = status;
	}

	if (minTotal || maxTotal) {
		if (minTotal && maxTotal) {
			filter.totalAmount = {
				$lte: parseFloat(maxTotal as string),
				$gte: parseFloat(minTotal as string),
			};
		}

		if (minTotal) {
			filter.totalAmount = { $gte: parseFloat(minTotal as string) };
		}

		if (maxTotal) {
			filter.totalAmount = { $lte: parseFloat(maxTotal as string) };
		}
	}

	// date filter
	if (toDate || fromDate) {
		if (toDate && fromDate) {
			filter.createdAt = {
				$lte: new Date(toDate as string),
				$gte: new Date(fromDate as string),
			};
		}

		if (fromDate) {
			filter.createdAt = { $gte: new Date(fromDate as string) };
		}

		if (toDate) {
			filter.createdAt = { $lte: new Date(toDate as string) };
		}
	}

	const allOrders = await Order.find(filter)
		.skip(skip)
		.limit(perPage)
		.populate("items.product")
		.populate("user", "-password")
		.sort({ createdAt: -1 });

	const totalCount = await Order.countDocuments(filter);

	res.status(201).json({
		success: true,
		status: "success",
		message: "Order fetched successfully",
		data: {
			data: allOrders,
			pagination: getPaginationData(currentPage, perPage, totalCount),
		},
	});
});

//get orders by user id

export const getByUserId = asyncHandler(async(req: Request, res: Response) => {
    
    const userId = req.user._id

    const orders = await Order.findOne({user:userId})
    .populate("items.product")
    .populate("user", "-password")

    res.status(201).json({
        status: 'success',
        success: true,
        message: 'order fetched successfully!',
        data: orders
    });
});


//update 

export const updateOrderStatus = asyncHandler(async(req:Request, res:Response) => {

    const orderId = req.params.id;

    const {status} = req.body;

    if(!status) {
        throw new CustomError('status is required', 404)
    }

    if(!orderId) {
        throw new CustomError('orderId is required', 400)
    }

    const updatedOrder = await Order.findByIdAndUpdate(orderId,
         {status}, 
         {new: true})

    if(!updatedOrder) {
        throw new CustomError('order not found', 404)
    }

    res.status(201).json({
        success:true,
        status: 'success',
        message: 'order status updated successfully',
        data: updatedOrder,
    })
})


//delete order 

export const deleteOrder = asyncHandler(async(req:Request, res:Response) => {

    const orderId = req.params.id;

    if(!orderId) {
        throw new CustomError('orderId is required', 400)
    }

    const deletedOrder = await Order.findByIdAndDelete(orderId)

    if(!deletedOrder) {
        throw new CustomError('order not found', 404)
    }

    res.status(201).json({
        success:true,
        status: 'success',
        message: 'order deleted successfully',
        data: deletedOrder,
    })
})


// cancel Order
export const cancelOrder = asyncHandler(async (req: Request, res: Response) => {

    const { orderId } = req.params;
    const userId = req.user._id;

    const order = await Order.findById(orderId);

    if (!order) {
        throw new CustomError('Order not found', 404);
    }

    if (order.user.toString() !== userId.toString()) {
        throw new CustomError('Unauthorized access to this order', 403);
    }

    if (['delivered', 'shipped', 'cancelled'].includes(order.status)) {
        throw new CustomError(`Order cannot be canceled when in ${order.status} status`, 400);
    }

    // Cancel the entire order
    order.status = 'cancelled';
    order.cancelledAt = new Date();

    await order.save();

    res.status(200).json({
        success: true,
        status: 'success',
        message: 'Order cancelled successfully!',
        data: order
    });
});
