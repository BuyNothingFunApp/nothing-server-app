import express from 'express';
import { CheckoutController } from '../controllers/checkout.controller';


const router = express.Router();
const checkoutController = new CheckoutController();

router.post('/', checkoutController.handleCheckout.bind(checkoutController));
router.post('/validate', checkoutController.validatePayment.bind(checkoutController));
router.post('/confirm', checkoutController.confirmOrder.bind(checkoutController));


export default router;