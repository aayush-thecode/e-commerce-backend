"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authentication_middleware_1 = require("../middleware/authentication.middleware");
const cart_controller_1 = require("../controllers/cart.controller");
const global_types_1 = require("../@types/global.types");
const router = express_1.default.Router();
//add to crate
router.post('/add', (0, authentication_middleware_1.Authenticate)(global_types_1.onlyUser), cart_controller_1.create);
// clear route 
router.delete('/clear', (0, authentication_middleware_1.Authenticate)(global_types_1.onlyUser), cart_controller_1.clearCart);
//get all 
router.get('/:userId', (0, authentication_middleware_1.Authenticate)(global_types_1.onlyUser), cart_controller_1.getCartByUserId);
//remove product from cart 
router.get('/remove/:productId', (0, authentication_middleware_1.Authenticate)(global_types_1.onlyUser), cart_controller_1.removeItemsFromCart);
exports.default = router;
