"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const review_controller_1 = require("../controllers/review.controller");
const authentication_middleware_1 = require("../middleware/authentication.middleware");
const global_types_1 = require("../@types/global.types");
const router = express_1.default.Router();
//get all user review
router.get('/', (0, authentication_middleware_1.Authenticate)(global_types_1.OnlyAdmin), review_controller_1.getAllReview);
// get user review by Id
router.get('/:productId', review_controller_1.getReviewId);
//create reviews
router.post('/', (0, authentication_middleware_1.Authenticate)(global_types_1.onlyUser), review_controller_1.createReview);
// update review by id
router.put('/:id', (0, authentication_middleware_1.Authenticate)(global_types_1.onlyUser), review_controller_1.update);
// delete review by id
router.delete('/:id', review_controller_1.deleteReview);
exports.default = router;
