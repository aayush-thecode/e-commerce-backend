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
exports.cancelOrder = exports.deleteOrder = exports.updateOrderStatus = exports.getByUserId = exports.getAllOrder = exports.placeOrder = void 0;
const asyncHandler_utils_1 = require("../utils/asyncHandler.utils");
const cart_model_1 = require("../models/cart.model");
const errorhandler_middleware_1 = require("../middleware/errorhandler.middleware");
const product_model_1 = __importDefault(require("../models/product.model"));
const order_model_1 = __importDefault(require("../models/order.model"));
const orderconfirmationEmail_utils_1 = require("../utils/orderconfirmationEmail.utils");
const pagination_utils_1 = require("../utils/pagination.utils");
//place order 
exports.placeOrder = (0, asyncHandler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const cart = yield cart_model_1.Cart.findOne({ user: userId }).populate('items.product');
    if (!cart) {
        throw new errorhandler_middleware_1.CustomError('Cart not found', 404);
    }
    const products = yield Promise.all(cart.items.map((item) => __awaiter(void 0, void 0, void 0, function* () {
        const product = yield product_model_1.default.findById(item.product);
        if (!product) {
            throw new errorhandler_middleware_1.CustomError('Product not found', 404);
        }
        return {
            product: item.product._id,
            quantity: item.quantity,
            totalPrice: Number(product.price) * item.quantity
        };
    })));
    const totalAmount = products.reduce((acc, item) => acc + item.totalPrice, 0);
    const order = new order_model_1.default({
        user: userId,
        items: products,
        totalAmount
    });
    const newOrder = yield order.save();
    const populatedOrder = yield order_model_1.default.findById(newOrder._id).populate("items.product");
    if (!populatedOrder) {
        throw new errorhandler_middleware_1.CustomError('order not created', 404);
    }
    yield (0, orderconfirmationEmail_utils_1.sendOrderConfirmationEmail)({
        to: req.user.email,
        orderDetails: populatedOrder
    });
    yield cart_model_1.Cart.findByIdAndDelete(cart._id);
    res.status(201).json({
        status: 'success',
        success: true,
        message: 'order placed successfully!',
        data: populatedOrder
    });
}));
//get all orders
exports.getAllOrder = (0, asyncHandler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, status, query, minTotal, maxTotal, toDate, fromDate } = req.query;
    let filter = {};
    const currentPage = parseInt(page) || 1;
    const perPage = parseInt(limit) || 10;
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
                $lte: parseFloat(maxTotal),
                $gte: parseFloat(minTotal),
            };
        }
        if (minTotal) {
            filter.totalAmount = { $gte: parseFloat(minTotal) };
        }
        if (maxTotal) {
            filter.totalAmount = { $lte: parseFloat(maxTotal) };
        }
    }
    // date filter
    if (toDate || fromDate) {
        if (toDate && fromDate) {
            filter.createdAt = {
                $lte: new Date(toDate),
                $gte: new Date(fromDate),
            };
        }
        if (fromDate) {
            filter.createdAt = { $gte: new Date(fromDate) };
        }
        if (toDate) {
            filter.createdAt = { $lte: new Date(toDate) };
        }
    }
    const allOrders = yield order_model_1.default.find(filter)
        .skip(skip)
        .limit(perPage)
        .populate("items.product")
        .populate("user", "-password")
        .sort({ createdAt: -1 });
    const totalCount = yield order_model_1.default.countDocuments(filter);
    res.status(201).json({
        success: true,
        status: "success",
        message: "Order fetched successfully",
        data: {
            data: allOrders,
            pagination: (0, pagination_utils_1.getPaginationData)(currentPage, perPage, totalCount),
        },
    });
}));
//get orders by user id
exports.getByUserId = (0, asyncHandler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const orders = yield order_model_1.default.findOne({ user: userId })
        .populate("items.product")
        .populate("user", "-password");
    res.status(201).json({
        status: 'success',
        success: true,
        message: 'order fetched successfully!',
        data: orders
    });
}));
//update 
exports.updateOrderStatus = (0, asyncHandler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orderId = req.params.id;
    const { status } = req.body;
    if (!status) {
        throw new errorhandler_middleware_1.CustomError('status is required', 404);
    }
    if (!orderId) {
        throw new errorhandler_middleware_1.CustomError('orderId is required', 400);
    }
    const updatedOrder = yield order_model_1.default.findByIdAndUpdate(orderId, { status }, { new: true });
    if (!updatedOrder) {
        throw new errorhandler_middleware_1.CustomError('order not found', 404);
    }
    res.status(201).json({
        success: true,
        status: 'success',
        message: 'order status updated successfully',
        data: updatedOrder,
    });
}));
//delete order 
exports.deleteOrder = (0, asyncHandler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orderId = req.params.id;
    if (!orderId) {
        throw new errorhandler_middleware_1.CustomError('orderId is required', 400);
    }
    const deletedOrder = yield order_model_1.default.findByIdAndDelete(orderId);
    if (!deletedOrder) {
        throw new errorhandler_middleware_1.CustomError('order not found', 404);
    }
    res.status(201).json({
        success: true,
        status: 'success',
        message: 'order deleted successfully',
        data: deletedOrder,
    });
}));
// cancel Order
exports.cancelOrder = (0, asyncHandler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderId } = req.params;
    const userId = req.user._id;
    const order = yield order_model_1.default.findById(orderId);
    if (!order) {
        throw new errorhandler_middleware_1.CustomError('Order not found', 404);
    }
    if (order.user.toString() !== userId.toString()) {
        throw new errorhandler_middleware_1.CustomError('Unauthorized access to this order', 403);
    }
    if (['delivered', 'shipped', 'cancelled'].includes(order.status)) {
        throw new errorhandler_middleware_1.CustomError(`Order cannot be canceled when in ${order.status} status`, 400);
    }
    // Cancel the entire order
    order.status = 'cancelled';
    order.cancelledAt = new Date();
    yield order.save();
    res.status(200).json({
        success: true,
        status: 'success',
        message: 'Order cancelled successfully!',
        data: order
    });
}));
