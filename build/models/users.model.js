"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const global_types_1 = require("../@types/global.types");
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const userSchema = new mongoose_1.default.Schema({
    firstName: {
        type: String,
        required: [true, 'first Name is required'],
        max: [50, 'first name cannot exceed 50 characters'],
        min: [3, 'first name should be atleast 3 characters']
    },
    lastName: {
        type: String,
        required: [true, 'first Name is required'],
        max: [50, 'last name cannot exceed 50 characters'],
        min: [3, 'last name should be atleast 3 characters']
    },
    email: {
        type: String,
        required: [true, 'email is required'],
        unique: [true, 'User with provided email already exits'],
        match: [emailRegex, "please use a valid email id"]
    },
    role: {
        type: String,
        enum: Object.values(global_types_1.Role),
        default: global_types_1.Role.user
    },
    phoneNumber: {
        type: String,
        required: false,
        min: [10, 'phone number must be atleast 10 digits']
    },
    password: {
        type: String,
        require: true,
        min: [6, 'password must be at least 6 character long']
    },
    gender: {
        type: String,
    },
    wishList: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            required: true,
            ref: 'product',
        }
    ]
}, { timestamps: true });
const User = mongoose_1.default.model('user', userSchema);
exports.default = User;
