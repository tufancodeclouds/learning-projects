import { Order } from "../models/order.model.js";
import { User } from "../models/user.model.js";
import { stripe, razorpayInstance } from "../utils/paymentGateways.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const currency = "inr";
const deliveryCharge = 10;

// COD Order
const placeOrder = asyncHandler(async (req, res) => {
  const { userId, items, amount, address } = req.body;

  const newOrder = await Order.create({
    userId,
    items,
    address,
    amount,
    paymentMethod: "COD",
    payment: false,
    date: Date.now(),
  });

  await User.findByIdAndUpdate(userId, { cartData: {} });

  res.status(201).json(new ApiResponse(201, newOrder, "Order placed with COD"));
});

// Stripe Order
const placeOrderStripe = asyncHandler(async (req, res) => {
  const { userId, items, amount, address } = req.body;
  const { origin } = req.headers;

  const newOrder = await Order.create({
    userId,
    items,
    address,
    amount,
    paymentMethod: "Stripe",
    payment: false,
    date: Date.now(),
  });

  const line_items = [
    ...items.map((item) => ({
      price_data: {
        currency,
        product_data: { name: item.name },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    })),
    {
      price_data: {
        currency,
        product_data: { name: "Delivery Charges" },
        unit_amount: deliveryCharge * 100,
      },
      quantity: 1,
    },
  ];

  const session = await stripe.checkout.sessions.create({
    success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
    cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
    line_items,
    mode: "payment",
  });

  res.status(200).json(new ApiResponse(200, { sessionUrl: session.url }, "Stripe session created"));
});

// Verify Stripe
const verifyStripe = asyncHandler(async (req, res) => {
  const { orderId, success, userId } = req.body;

  if (success === "true") {
    await Order.findByIdAndUpdate(orderId, { payment: true });
    await User.findByIdAndUpdate(userId, { cartData: {} });
    return res.status(200).json(new ApiResponse(200, {}, "Stripe payment successful"));
  }

  await Order.findByIdAndDelete(orderId);
  res.status(400).json(new ApiResponse(400, {}, "Stripe payment failed"));
});

// Razorpay Order
const placeOrderRazorpay = asyncHandler(async (req, res) => {
  const { userId, items, amount, address } = req.body;

  const newOrder = await Order.create({
    userId,
    items,
    address,
    amount,
    paymentMethod: "Razorpay",
    payment: false,
    date: Date.now(),
  });

  const options = {
    amount: amount * 100,
    currency: currency.toUpperCase(),
    receipt: newOrder._id.toString(),
  };

  razorpayInstance.orders.create(options, (err, order) => {
    if (err) {
      console.error(err);
      return res.status(500).json(new ApiError(500, "Razorpay order creation failed"));
    }
    res.status(200).json(new ApiResponse(200, order, "Razorpay order created"));
  });
});

// Verify Razorpay
const verifyRazorpay = asyncHandler(async (req, res) => {
  const { userId, razorpay_order_id } = req.body;

  const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

  if (orderInfo.status === "paid") {
    await Order.findByIdAndUpdate(orderInfo.receipt, { payment: true });
    await User.findByIdAndUpdate(userId, { cartData: {} });
    return res.status(200).json(new ApiResponse(200, {}, "Razorpay payment successful"));
  }

  res.status(400).json(new ApiResponse(400, {}, "Razorpay payment failed"));
});

// Admin - All Orders
const allOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({});
  res.status(200).json(new ApiResponse(200, orders, "All orders fetched"));
});

// User - Orders
const userOrders = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  const orders = await Order.find({ userId });
  res.status(200).json(new ApiResponse(200, orders, "User orders fetched"));
});

// Admin - Update Order Status
const updateStatus = asyncHandler(async (req, res) => {
  const { orderId, status } = req.body;
  await Order.findByIdAndUpdate(orderId, { status });
  res.status(200).json(new ApiResponse(200, {}, "Order status updated"));
});

export {
  placeOrder,
  placeOrderStripe,
  verifyStripe,
  placeOrderRazorpay,
  verifyRazorpay,
  allOrders,
  userOrders,
  updateStatus,
};
