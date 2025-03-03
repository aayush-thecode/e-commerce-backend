import { Request, Response } from "express";
import User from "../models/users.model";
import {hash, compare} from '../utils/bcrypt.utils'
import { generateToken } from "../utils/jwt.utils";
import { IPayload } from "../@types/jwt.interface";
import { asyncHandler } from "../utils/asyncHandler.utils";
import { CustomError } from "../middleware/errorhandler.middleware";


//get user
export const getAllData = asyncHandler(async (req: Request, res: Response) => {

      const users = await User.find();
      res.status(200).json({
          success: true,
          status: "success",
          data: users,
          message: "users fetched successfully",
        });
    })


    //register user ....
export const register = asyncHandler(async (req: Request, res:Response) => {

      const body = req.body;

      if(!body.password) {
          throw new CustomError('password us required', 400)
      }
      const hashedPassword = await hash(body.password)
      
      console.log("🚀 ~ register ~ hashedPassword:", hashedPassword)


      body.password = hashedPassword

      const user= await User.create(body)

      res.status(201).json ({
          status: 'success',
          success: true,
          message: 'User registered sucessfully',
          data: user,
      })

  })

//update 
export const update = asyncHandler(async  (req: Request, res:Response) => {

      const id = req.params.id;
      const {firstName, LastName, phoneNumber, gender} = req.body

      const user = await User.findByIdAndUpdate(id, {
          firstName,
          LastName,
          phoneNumber,
          gender
}, {new:true}) 

      if(!user) {
         throw new CustomError('user is required', 400)
      }

      res.status(201).json ({
          status: 'success',
          success: true,
          message: 'user registered sucessfully',
          data: user
      })

  })


// Login user

export const login = asyncHandler(async (req: Request, res: Response) => {

    const { email, password } = req.body;

    if (!email) {
     throw new CustomError('email is required', 400)
    }

    if (!password) {
      throw new CustomError('Password is required', 400);
    }

    const user = await User.findOne({ email });

    if (!user) {
      throw new CustomError('Wrong credentials provided', 400)

      return; 
    }

    //compare hash
    const isMatch = compare (password, user?.password as string);

    if (!isMatch) {

      throw new CustomError('Wrong credentials provided', 400)

      return ;
    }
      const payload:IPayload = {
          _id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role:user.role
      }

      const token = generateToken(payload);

  res.cookie('access_token', token,{
      
      httpOnly:true,
      secure: process.env.NODE_ENV === 'production'

  }).status(200).json({
    status: "success",
    success: true,
    message: "Login successful",
    token,

  });
});