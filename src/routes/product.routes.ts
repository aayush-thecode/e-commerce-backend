import express from 'express'
import { create, getAll, getProductById, remove, update } from '../controllers/product.controller';
import multer from "multer";
import { Authenticate } from '../middleware/authentication.middleware';
import { OnlyAdmin } from '../@types/global.types';
import { cloudinary } from '../config/cloudinary.config';
import { CloudinaryStorage } from 'multer-storage-cloudinary';


const router = express.Router()

//storage 

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // async code using `req` and `file`
    // ...
    return {
      folder: 'ecom/products',
      allowed_formats: ['jpeg', 'jpg', 'png', 'webp'],
    };
  },
});

  const upload = multer({storage: storage})

//create product 

router.post('/', Authenticate(OnlyAdmin), upload.fields ([
  {
    name: 'coverImage',
    maxCount:1
  },
  {
    name: 'images',
    maxCount:6
  }
]), create) 



//update products by id 
router.put('/:id',Authenticate(OnlyAdmin), upload.fields ([
  {
    name: 'coverImage',
    maxCount:1
  },
  {
    name: 'images',
    maxCount:6
  }
]), update)


//delete product by id 
router.delete('/:id', Authenticate(OnlyAdmin), remove)

//get product by id
router.get('/:id', getProductById)

//get all products
router.get('/', getAll);


export default router; 