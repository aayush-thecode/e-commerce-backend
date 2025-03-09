import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.utils";
import Product from "../models/product.model";
import { CustomError } from "../middleware/errorhandler.middleware";
import { deleteFiles } from "../utils/deleteFIles.utils";
import Category from "../models/category.model";


//create product 

export const create = asyncHandler(async (req: Request, res: Response) => {

	const body = req.body;
	const product = await Product.create(body);
    
	const { coverImage, images } = req.files as {
		[fieldname: string]: Express.Multer.File[];
	};
	if (!coverImage) {
		throw new CustomError("Cover image is required", 400);
	}

	product.coverImage = coverImage[0]?.path;

	if (images && images.length > 0) {
		const imagePath: string[] = images.map(
			(image: any, index: number) => image.path
		);
		product.images = imagePath;
	}

	await product.save();

	res.status(201).json({
		status: "success",
		success: true,
		data: product,
		message: "Product created successfully!",
	});
});



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

export const update = asyncHandler(async (req: Request, res: Response) => {

    const {deletedImages, name, price, description, categoryId } = req.body;

    const id = req.params.id; 
    
    const {coverImage, images} = req.files as {
        [feildname: string]: Express.Multer.File[]
    }


    const product = await Product.findByIdAndUpdate( id, 
        {name, price, description},
        {new: true}
    );

    if(!product) {

        throw new CustomError('', 404)
    }

    if(categoryId) {

        const category = await Category.findById(categoryId)
        if(!category) {

            throw new CustomError('category not found',404)
        }
        product.category = categoryId;

    }


    if(coverImage) {

        await deleteFiles([product.coverImage as string])
        product.coverImage = coverImage[0]?.path

    }


    if(deletedImages && deletedImages.length > 0) { 

    await deleteFiles(deletedImages as string[])
    product.images = product.images.filter(
        (image) => !deletedImages.includes(image))


    }


    if(images && images.length > 0) {

    const imagePath: string[] = images.map(
        (image: any, index: number) => image.path);
    product.images = [...product.images,...imagePath];

}

    await product.save()

    res.status(201).json({
        success:true,
        status:'success',
        data: product,
        message: 'updated successfully!'
    })
})



//delete productby Id 

export const remove = asyncHandler(async (req: Request, res: Response) => {

    const id = req.params.id;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
        throw new CustomError('Product not found', 404);
    }

    // Delete associated images if they exist

    const imagesToDelete: string[] = [];
    
    if (product.coverImage) {
        imagesToDelete.push(product.coverImage as string);
    }

    if (product.images && product.images.length > 0) {

        imagesToDelete.push(...product.images as string[]);
    }

    // Delete files if there are any
    
    if (imagesToDelete.length > 0) {
        await deleteFiles(imagesToDelete);
    }

    res.status(201).json({
        success: true,
        status: 'success',
        message: 'Product deleted successfully!'

    });
});