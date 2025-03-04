import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.utils";
import Product from "../models/product.model";
import { CustomError } from "../middleware/errorhandler.middleware";


//create
export const create = asyncHandler(async (req: Request, res: Response) => {

    const body = req.body;
    const product = await Product.create(body)
    
    console.log(req.files)
    const {coverImage, images} = req.files as {[feildname: string]: Express.Multer.File[]}


if(!coverImage) {
    throw new CustomError('cover Image is required',400);
}

product.coverImage = coverImage[0]?.path

if(images && images.length > 0) {
    const imagePath: string[] = images.map((image: any, index: number) => image.path)
    product.images = imagePath
}

    await product.save()

    res.status(201).json({
        success:true,
        status:'success',
        data: product,
        message: 'Product fetched successfully!'
    })
})



// getall product data 

export const getAll = asyncHandler(async (req: Request, res: Response) => {

    const products = await Product.find({}).populate('createdBy')

    res.status(200).json ({
        success:true,
        status:'success',
        data: products,
        message: 'Product fetched successfully!'
    })
})


// get product by id

export const getProductById = asyncHandler(async (req: Request, res: Response) => {
    
    const productId = req.params.id;

    const product = await Product.findById(productId)

    if(!productId) {
        throw new CustomError('product not found', 404); 
    }

    res.status(201).json ({
        status: 'successfull',
        data: product,
        success: true,
        message: 'product fetched successfully!'
    })


})

//update product 
export const UpdateProduct = asyncHandler(async (req: Request, res: Response) => {

    const productId = req.params.id; 
    const {name, price, createdBy, description} = req.body; 

    const product = await Product.findByIdAndUpdate(productId, {
        name,
        price,
        createdBy,
        description
    }, {new:true})

if(!Product) {
    throw new CustomError('product is required', 400)
}

    res.status(201).json ({
    status: 'success',
    success: true,
    message: 'Product Updated successfully',
    data: product

    })

})


//delete productby Id 

export const deleteProductById = asyncHandler (async(req: Request, res: Response) => {

    const productId = req.params.id;

    const deleteProductById = await Product.findByIdAndDelete(productId);

    if (!Product) {
        throw new CustomError('product not found', 404)
    }

    res.status(200).json ({
        status: 'success',
        success: true,
        message: 'Product deleted successfully!',
        data: deleteProductById,
    })
})