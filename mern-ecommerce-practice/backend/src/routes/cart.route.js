import { Router } from "express";
import {
  addToCart,
  getUserCart,
  updateCart,
  mergeGuestCart
} from "../controllers/cartController.js";
import { authenticate } from "../middlewares/authenticate.middleware.js";

const cartRouter = Router();

// Get current user's cart (read operation)
cartRouter.route("/").get(authenticate, getUserCart);

// Add item to cart (create operation)
cartRouter.route("/").post(authenticate, addToCart);

// Update item in cart (update operation)
cartRouter.route("/:itemId").patch(authenticate, updateCart);

// Merge guest cart into user cart (custom operation)
cartRouter.route("/merge").post(authenticate, mergeGuestCart);

export default cartRouter;
