"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const authentication_middleware_1 = require("../middleware/authentication.middleware");
const global_types_1 = require("../@types/global.types");
const router = express_1.default.Router();
//register user
router.post('/', user_controller_1.register);
// update user profile
router.put('/:id', (0, authentication_middleware_1.Authenticate)(global_types_1.onlyUser), user_controller_1.update);
// login 
router.post('/login', user_controller_1.login);
//get all users
router.get('/', (0, authentication_middleware_1.Authenticate)(global_types_1.OnlyAdmin), user_controller_1.getAllUserData);
//get user by id 
router.get('/:id', (0, authentication_middleware_1.Authenticate)(global_types_1.OnlyAdmin), user_controller_1.getUserDataById);
//delete user by id 
router.delete('/:id', (0, authentication_middleware_1.Authenticate)(global_types_1.OnlyAdmin), user_controller_1.deleteUserById);
//admin login
router.post('/admin/login', user_controller_1.adminLogin);
exports.default = router;
