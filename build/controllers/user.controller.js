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
exports.deleteUserById = exports.login = exports.update = exports.register = exports.getUserDataById = exports.getAllUserData = void 0;
const users_model_1 = __importDefault(require("../models/users.model"));
const bcrypt_utils_1 = require("../utils/bcrypt.utils");
const jwt_utils_1 = require("../utils/jwt.utils");
const asyncHandler_utils_1 = require("../utils/asyncHandler.utils");
const errorhandler_middleware_1 = require("../middleware/errorhandler.middleware");
const pagination_utils_1 = require("../utils/pagination.utils");
//get  all user data 
exports.getAllUserData = (0, asyncHandler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, query, role } = req.query;
    const currentPage = parseInt(page) || 1;
    const queryLimit = parseInt(limit) || 10;
    const skip = (currentPage - 1) * queryLimit;
    let filter = {};
    // Filter by role
    if (role) {
        filter.role = role;
    }
    // Text search query
    if (query) {
        filter.$or = [
            { firstName: { $regex: query, $options: 'i' } },
            { lastName: { $regex: query, $options: 'i' } },
            { email: { $regex: query, $options: 'i' } },
            { phoneNumber: { $regex: query, $options: 'i' } }
        ];
    }
    const users = yield users_model_1.default.find(filter)
        .select('-password') // Exclude password from results
        .skip(skip)
        .limit(queryLimit)
        .sort({ createdAt: -1 });
    const totalCount = yield users_model_1.default.countDocuments(filter);
    const pagination = (0, pagination_utils_1.getPaginationData)(currentPage, queryLimit, totalCount);
    res.status(200).json({
        success: true,
        status: "success",
        data: {
            data: users,
            pagination,
        },
        message: "Users fetched successfully",
    });
}));
// get user by id 
exports.getUserDataById = (0, asyncHandler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const usersId = req.params.id;
    const user = yield users_model_1.default.findById(usersId);
    if (!usersId) {
        throw new errorhandler_middleware_1.CustomError('user not found by the given id', 400);
    }
    res.status(201).json({
        status: 'success',
        success: true,
        message: 'User found successfully!',
        data: user
    });
}));
//register user ....
exports.register = (0, asyncHandler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    if (!body.password) {
        throw new errorhandler_middleware_1.CustomError('password is required', 400);
    }
    const hashedPassword = yield (0, bcrypt_utils_1.hash)(body.password);
    console.log("🚀 ~ register ~ hashedPassword:", hashedPassword);
    body.password = hashedPassword;
    const user = yield users_model_1.default.create(body);
    console.log(user);
    res.status(201).json({
        status: 'success',
        success: true,
        message: 'User registered sucessfully',
        data: user,
    });
}));
//update user by id 
exports.update = (0, asyncHandler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const { firstName, lastName, phoneNumber, gender } = req.body;
    const user = yield users_model_1.default.findByIdAndUpdate(id, {
        firstName,
        lastName,
        phoneNumber,
        gender
    }, { new: true });
    if (!user) {
        throw new errorhandler_middleware_1.CustomError('user is required', 400);
    }
    res.status(201).json({
        status: 'success',
        success: true,
        message: 'user registered sucessfully',
        data: user
    });
}));
// Login user
exports.login = (0, asyncHandler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email) {
        throw new errorhandler_middleware_1.CustomError('email is required', 400);
    }
    if (!password) {
        throw new errorhandler_middleware_1.CustomError('Password is required', 400);
    }
    const user = yield users_model_1.default.findOne({ email });
    if (!user) {
        throw new errorhandler_middleware_1.CustomError('Wrong credentials provided', 400);
    }
    //-----------compare hash------------------
    const isMatch = yield (0, bcrypt_utils_1.compare)(password, user.password);
    if (!isMatch) {
        throw new errorhandler_middleware_1.CustomError('Wrong credentials provided', 400);
    }
    const payload = {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
    };
    const token = (0, jwt_utils_1.generateToken)(payload);
    console.log("🚀 ~ login ~ token:", token);
    res.cookie('access_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
    }).status(200).json({
        status: "success",
        success: true,
        message: "Login successful",
        token,
    });
}));
//delete user by id 
exports.deleteUserById = (0, asyncHandler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const deleteId = req.params.id;
    const deleteUserId = yield users_model_1.default.findByIdAndDelete(deleteId);
    if (!deleteId) {
        throw new errorhandler_middleware_1.CustomError('Id mismatched and cannot delete', 400);
    }
    res.status(201).json({
        status: 'success',
        success: true,
        message: 'user deleted sucessfully',
        data: deleteUserId,
    });
}));
