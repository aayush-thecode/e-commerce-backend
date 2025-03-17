import { IPayload } from "./jwt.interface";

declare global {

    namespace Express {

        interface Request{

            user:IPayload

        }

    }
}