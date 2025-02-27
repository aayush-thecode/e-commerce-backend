import jwt from 'jsonwebtoken'
import { IPayload } from '../@types/jwt.interface'
const JWT_SECRET = process.env.JWT_SECRET || ''
const TOKEN_EXPIRES_IN = process.env.TOKEN_EXPIRES_IN

export const generateToken = (payload:IPayload) => {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: TOKEN_EXPIRES_IN
    })
}