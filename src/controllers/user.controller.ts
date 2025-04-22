import { Request, Response } from "express";
import User from "../models/users.model";
import {hash, compare} from '../utils/bcrypt.utils'
import { generateToken } from "../utils/jwt.utils";
import { IPayload } from "../@types/jwt.interface";
import { asyncHandler } from "../utils/asyncHandler.utils";
import { CustomError } from "../middleware/errorhandler.middleware";
import { getPaginationData } from "../utils/pagination.utils";


//get  all user data 

export const getAllUserData = asyncHandler(async (req: Request, res: Response) => {
  
  const {page, limit, query, role} = req.query;
  
  const currentPage = parseInt(page as string) || 1;
  const queryLimit = parseInt(limit as string) || 10;
  const skip = (currentPage - 1) * queryLimit;
  
  let filter: Record<string, any> = {};
  
  // Filter by role
  if(role) {
      filter.role = role;
  }
  
  // Text search query
  if(query) {
      filter.$or = [
          { firstName: { $regex: query, $options: 'i' } },
          { lastName: { $regex: query, $options: 'i' } },
          { email: { $regex: query, $options: 'i' } },
          { phoneNumber: { $regex: query, $options: 'i' } }
      ];
  }
  
  const users = await User.find(filter)
      .select('-password') // Exclude password from results
      .skip(skip)
      .limit(queryLimit)
      .sort({ createdAt: -1 });
  
  const totalCount = await User.countDocuments(filter);
  
  const pagination = getPaginationData(currentPage, queryLimit, totalCount);
  
  res.status(200).json({
      success: true,
      status: "success",
      data: {
          data: users,
          pagination,
      },
      message: "Users fetched successfully",
  });
});


// get user by id 

export const getUserDataById = asyncHandler(async (req: Request, res: Response) => {

  const usersId = req.params.id;

  const user = await User.findById(usersId)

  if(!usersId) {

    throw new CustomError('user not found by the given id', 400);

  }

      res.status(201).json ({
      status:'success',
      success: true,
      message:'User found successfully!',
      data: user

    })
})


//register user ....

export const register = asyncHandler(async (req: Request, res:Response) => {

      const body = req.body;

      if(!body.password) {
          throw new CustomError('password is required', 400)
      }
      const hashedPassword = await hash(body.password)
      
      console.log("🚀 ~ register ~ hashedPassword:", hashedPassword)


      body.password = hashedPassword

      const user= await User.create(body)
      console.log(user);

      res.status(201).json ({
          status: 'success',
          success: true,
          message: 'User registered sucessfully',
          data: user,
      })

  })


//update user by id 

export const update = asyncHandler(async  (req: Request, res:Response) => {

      const id = req.params.id;
      const {firstName, lastName, phoneNumber, gender} = req.body;

      const user = await User.findByIdAndUpdate(id, {

          firstName,
          lastName,
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
  
    }

  //-----------compare hash------------------

    const isMatch = await compare(password, user.password as string);

    if (!isMatch) {

      throw new CustomError('Wrong credentials provided', 400)


    }
      const payload: IPayload = {

          _id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role:user.role,

      }

      const token = generateToken(payload);

      console.log("🚀 ~ login ~ token:", token)

    res.cookie('access_token', token,{
      
      httpOnly:true,
      secure: process.env.NODE_ENV === 'production'

    }).status(200).json({
    status: "success",
    success: true,
    message: "Login successful",
    token,user

    });

});

//delete user by id 

export const deleteUserById = asyncHandler( async(req: Request, res:Response) => {

const deleteId = req.params.id

const deleteUserId = await User.findByIdAndDelete(deleteId)

if(!deleteId) {
  
  throw new CustomError('Id mismatched and cannot delete', 400);

}

res.status(201).json({
  
  status:'success',
  success:true,
  message: 'user deleted sucessfully',
  data: deleteUserId,
  
  })

}) 