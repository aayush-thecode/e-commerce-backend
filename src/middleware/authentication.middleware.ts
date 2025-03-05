import { NextFunction, Request, Response } from "express"
import { CustomError } from "./errorhandler.middleware"
import { Role } from "../@types/global.types";
import { verifyToken } from "../utils/jwt.utils";
import { JwtPayload } from "jsonwebtoken";
import User from "../models/users.model";



export const Authenticate = (roles?:Role[]) => {

    return async (req:Request, res:Response, next: NextFunction) => {

        try{

        const authHeader = req.headers['authorization'] as string

        if(!authHeader || !authHeader.startsWith('BEARER') ){

            throw new CustomError('Unauthorized token is missing', 401)

        }

        const access_token = authHeader.split(' ')[1] 


        if(!access_token) {

            throw new CustomError('Unauthorized, token is missing! ,access denied!', 401)

        }

        const decoded: JwtPayload = verifyToken(access_token)

        if(decoded.exp && decoded.exp * 1000 > Date.now())

        if(!decoded) {

        console.log("🚀 ~ return ~ decoded:", decoded)

            throw new CustomError('Unauthorized, Invalid token', 401)

        }



        const user = await User.findById(decoded._id)

        if(!user) {

            throw new CustomError('User not found', 400); 

        }

        if(roles && !roles.includes(user.role)) {

            throw new CustomError(`Forbidden, ${user.role} can not acess this resource`, 403)

        }

        req.user = {
            _id:decoded._id,
            firstName: decoded.firstName,
            lastName: decoded.lastName,
            role: decoded.role,
            email: decoded.email
        }

        next()

        } catch(err:any) {

            throw new CustomError(err?.message ?? 'something went wrong',400);

        }

    }

}