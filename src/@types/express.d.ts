import { IPayload } from "./jwt.interface";

declare global {

    namespace Express {

        export interface Request{

            user?:IPayload

        }

    }
}