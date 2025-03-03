import express from 'express'
import { create, deleteProductById, getAll, getProductById, UpdateProduct } from '../controllers/product.controller';
import multer from "multer";



const router = express.Router()

//storage 
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null,file.fieldname + '-' + uniqueSuffix + '-' + file.originalname)
    }
  })

  const upload = multer({storage: storage})

//create product 

router.post('/', upload.fields ([
  {
    name: 'coverImage',
    maxCount:1
  },
  {
    name: 'images',
    maxCount:6
  }
]), create) 

//register user
router.post('/', upload.single('coverImage'), create);


//get all products
router.get('/', getAll);


//update products by id 
router.put('/:id', UpdateProduct)


//delete product by id 
router.delete('/:id', deleteProductById)

//get product by id
router.get('/:id', getProductById)

export default router; 