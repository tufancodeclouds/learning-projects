import { Router } from "express";
import {
    allOrders,
    updateStatus,
    placeOrder,
    placeOrderStripe,
    placeOrderRazorpay,
    userOrders,
    verifyStripe,
    verifyRazorpay
} from '../controllers/orderController.js';
import { adminAuthenticate } from "../middlewares/adminAuthenticate.middleware.js";
import { authenticate } from "../middlewares/authenticate.middleware.js";

const orderRouter = Router();

// Admin Features
orderRouter.post('/list',adminAuthenticate,allOrders);
orderRouter.post('/status',adminAuthenticate,updateStatus);

// Payment Features
orderRouter.post('/place',authenticate,placeOrder);
orderRouter.post('/stripe',authenticate,placeOrderStripe);
orderRouter.post('/razorpay',authenticate,placeOrderRazorpay);

// User Feature
orderRouter.post('/userorders',authenticate,userOrders);

// verify payment
orderRouter.post('/verifyStripe',authenticate, verifyStripe);
orderRouter.post('/verifyRazorpay',authenticate, verifyRazorpay);

export default orderRouter;
