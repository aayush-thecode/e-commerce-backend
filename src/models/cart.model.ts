
import {Schema, model}from "mongoose";

const cartSchema = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        required: true,
        ref:'user'
    },
    items:[{
        product:{
            type: Schema.Types.ObjectId,
            ref:'product',
            required: true
        },
        quantity: {
            type:Number,
            required: true
        }
       
    }],

}, {timestamps: true} )

export const Cart = model('cart',cartSchema );

