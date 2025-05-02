import mongoose from 'mongoose'

const productSchema = new mongoose.Schema ({
    name: {
        type: String,
        required: [true, ' Product name is required'],
        trim: true,
    },
    price: {
        type: Number,
        required: [true, 'price is required '],
        min: [0, 'price should be greater than 0']
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: [true, ' Author is required ']
    },
    category: {
        type: mongoose.Types.ObjectId,
        ref: 'category',
        required: [true, 'Category is required']
    },
    description: {
        type: String,
        required: false,
        min:[50, 'description should be atleast 50 character long'],
        trim: true,
    },
    coverImage: {
            public_id:{
                type:String,
                required:true,
            },
            path:{
                type:String,
                required:true,
            },
            required:true,
    },
    images: [
        {
        public_id:{
            type:String,
            required:true,
        },
        path:{
            type:String,
            required:true,
        },
        // required:true,
    }],
    reviews: [
        {
            type:mongoose.Types.ObjectId,
            ref:'review',
            required: false
        }
    ],
    averageRating: {
        type: Number,
        default: 0,
    }

},{timestamps: true});



const Product = mongoose.model('product',productSchema);
export default Product; 