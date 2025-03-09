import mongoose, { mongo } from "mongoose";
import { Role } from "../@types/global.types"; 
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

const userSchema = new mongoose.Schema({
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
    role:{
        type: String,
        enum: Object.values(Role),
        default: Role.user
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
            type:mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'product',
        }
]

},{timestamps: true}) 

const User = mongoose.model('user', userSchema)

export default User