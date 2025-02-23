import { Request, Response } from "express";
import User from "../models/users.model";


export const register = async (req: Request, res:Response) => {
    try {

        const body = req.body;
        await User.create(body)
        const user = new User ()

        res.status(201).json ({
            status: 'success',
            success: true,
            message: 'user registered sucessfully',
            data: user
        })

    } catch (error:any) {

        res.status(500).json ({
            status:'fail',
            success: false,
            message: error?.message || 'something went wrong'

        })
    }
}

export const update = async  (req: Request, res:Response) => {
    try {

        const Id = req.params.id;
        const {firstName, LastName, phoneNumber, gender} = req.body

        const user = await User.findByIdAndUpdate(Id, {
            firstName,
            LastName,
            phoneNumber,
            gender
        },{new:true})

        if(!user) {
            res.status(404).json ({
                status: 'fail',
                success: false,
                message: 'user not found',
  
        })
        }
        res.status(201).json ({
            status: 'success',
            success: true,
            message: 'user registered sucessfully',
            data: user
        })

    } catch (error:any) {

        res.status(500).json ({
            status:'fail',
            success: false,
            message: error?.message || 'something went wrong'

        })
    }
}

// export const login = (req,res) => {
//     // 1. email pass <-- body
// }