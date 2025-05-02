"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const product_controller_1 = require("../controllers/product.controller");
const multer_1 = __importDefault(require("multer"));
const authentication_middleware_1 = require("../middleware/authentication.middleware");
const global_types_1 = require("../@types/global.types");
const router = express_1.default.Router();
//storage 
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
        console.log(file);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});
const upload = (0, multer_1.default)({ storage: storage });
//create product 
router.post('/', (0, authentication_middleware_1.Authenticate)(global_types_1.OnlyAdmin), upload.fields([
    {
        name: 'coverImage',
        maxCount: 1
    },
    {
        name: 'images',
        maxCount: 6
    }
]), product_controller_1.create);
//update products by id 
router.put('/:id', (0, authentication_middleware_1.Authenticate)(global_types_1.OnlyAdmin), upload.fields([
    {
        name: 'coverImage',
        maxCount: 1
    },
    {
        name: 'images',
        maxCount: 6
    }
]), product_controller_1.update);
//delete product by id 
router.delete('/:id', (0, authentication_middleware_1.Authenticate)(global_types_1.OnlyAdmin), product_controller_1.remove);
//get product by id
router.get('/:id', product_controller_1.getProductById);
//get all products
router.get('/', product_controller_1.getAll);
exports.default = router;
