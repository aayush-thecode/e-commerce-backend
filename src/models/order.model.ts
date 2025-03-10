import {Schema, model} from 'mongoose'

const orderSchema = new Schema ({
    user: {
        type:Schema.Types.ObjectId,
        ref:'user',
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'shipped', 'canceled', 'delivered', 'processing'],
        default: 'pending',
    },
    items: [
        {
            product:{
                type: Schema.Types.ObjectId,
                ref:'prodcut',
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
            totalPrice: {
                type: Number,
                required: true,
            }
        }
    ], 
    totalAmount: {
        type: Number,
        required: true,
    }
}, {timestamps: true})

const Order  = model('order', orderSchema)

export default Order

