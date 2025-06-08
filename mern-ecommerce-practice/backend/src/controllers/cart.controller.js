import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";

// Add product to cart
const addToCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { itemId, size } = req.body;

  if (!itemId || !size) {
    throw new ApiError(400, "itemId and size are required");
  }

  const userData = await User.findById(userId);
  if (!userData) throw new ApiError(404, "User not found");

  const cartData = userData.cartData || {};
  cartData[itemId] = cartData[itemId] || {};
  cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;

  await User.findByIdAndUpdate(userId, { cartData });

  res.json(new ApiResponse(200, null, "Item added to cart"));
});

// Update item quantity in cart
const updateCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { size, quantity } = req.body;
  const { itemId } = req.params;

  if (!itemId || !size || typeof quantity !== "number") {
    throw new ApiError(400, "itemId, size and valid quantity are required");
  }

  const userData = await User.findById(userId);
  if (!userData) throw new ApiError(404, "User not found");

  const cartData = userData.cartData || {};
  cartData[itemId] = cartData[itemId] || {};
  cartData[itemId][size] = quantity;

  await User.findByIdAndUpdate(userId, { cartData });

  res.json(new ApiResponse(200, null, "Cart updated"));
});

// Get user cart
const getUserCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const userData = await User.findById(userId);
  if (!userData) throw new ApiError(404, "User not found");

  const cartData = userData.cartData || {};

  res.json(new ApiResponse(200, cartData, "Cart retrieved successfully"));
});

// Merge guest cart with user cart
const mergeGuestCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { cart: guestCart } = req.body;

  if (!guestCart || typeof guestCart !== "object") {
    throw new ApiError(400, "Invalid guest cart format");
  }

  const userData = await User.findById(userId);
  if (!userData) throw new ApiError(404, "User not found");

  const serverCart = userData.cartData || {};

  for (const itemId in guestCart) {
    serverCart[itemId] = serverCart[itemId] || {};

    for (const size in guestCart[itemId]) {
      serverCart[itemId][size] =
        (serverCart[itemId][size] || 0) + guestCart[itemId][size];
    }
  }

  await User.findByIdAndUpdate(userId, { cartData: serverCart });

  res.json(new ApiResponse(200, null, "Guest cart merged successfully"));
});

export { addToCart, updateCart, getUserCart, mergeGuestCart };
