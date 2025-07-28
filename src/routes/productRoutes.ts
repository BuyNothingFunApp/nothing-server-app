
import express from 'express';
import { ProductController } from '../controllers/product.controller';

const router = express.Router();
const productController = new ProductController();

router.get('/', productController.getProduct.bind(productController));
router.get('/:id', productController.getProductById.bind(productController));


export default router;