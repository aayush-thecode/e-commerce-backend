import { NextFunction, Request, Response } from "express"
import { CustomError } from "./errorhandler.middleware"
import { Role } from "../@types/global.types";
import { verifyToken } from "../utils/jwt.utils";
import { JwtPayload } from "jsonwebtoken";



export const Authenticate = (roles?:Role[]) => {

    return (req:Request, res:Response, next: NextFunction) => {

        try{

        const token = req.headers['authorization'] as string

        if(!token || !token.startsWith('BEARER') ){

            throw new CustomError('Unauthorized', 401)

        }

        const access_token = token.split(' ')[1] 


        if(!access_token) {

            throw new CustomError('Unauthorized, access denied!', 401)

        }

        const decoded: JwtPayload = verifyToken(access_token)

        if(decoded.exp && decoded.exp * 1000 > Date.now())

        if(!decoded) {

        console.log("🚀 ~ return ~ decoded:", decoded)

            throw new CustomError('Unauthorized, Invalid token', 401)

        }

        if(roles && !roles.includes(decoded.role)) {

            throw new CustomError('Forbidden, unauthorized to access this resource', 401)

        }


        next()

        } catch(err:any) {

            throw new CustomError(err?.message ?? 'something went wrong',400);

        }

    }

}