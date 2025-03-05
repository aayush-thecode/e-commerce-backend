import express from 'express'
import { create, getAll, getProductById, update } from '../controllers/product.controller';
import multer from "multer";
import { Authenticate } from '../middleware/authentication.middleware';
import { OnlyAdmin } from '../@types/global.types';
import { deleteCategoryById } from '../controllers/category.controller';



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

//register user
router.post('/', upload.single('coverImage'), create);


//get all products
router.get('/', getAll);


//update products by id 
router.put('/:id', update);


//delete product by id 
router.delete('/:id', deleteCategoryById)

//get product by id
router.get('/:id', getProductById)

export default router; 