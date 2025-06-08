import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Product } from "../models/Product.js";

// Add Product
const addProduct = asyncHandler(async (req, res) => {
  const { name, description, price, category, subCategory, sizes, bestseller } = req.body;

  if (!name || !description || !price || !category) {
    throw new ApiError(400, "Missing required product fields");
  }

  let parsedSizes;
  try {
    parsedSizes = JSON.parse(sizes);
  } catch (err) {
    throw new ApiError(400, "Invalid format for sizes. Must be JSON array.");
  }

  const files = ["image1", "image2", "image3", "image4"]
    .map(key => req.files?.[key]?.[0])
    .filter(Boolean);

  const imageUrls = await Promise.all(
    files.map(async (file) => {
      const result = await uploadOnCloudinary(file.path);
      if (!result?.secure_url) {
        throw new ApiError(500, "Image upload failed");
      }
      return result.secure_url;
    })
  );

  const product = await Product.create({
    name,
    description,
    category,
    subCategory,
    price: Number(price),
    sizes: parsedSizes,
    bestseller: bestseller === "true",
    image: imageUrls,
    date: Date.now(),
  });

  return res
    .status(201)
    .json(new ApiResponse(201, product, "Product added successfully"));
});

// List Products
const listProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ date: -1 }); // newest first

  return res
    .status(200)
    .json(new ApiResponse(200, products, "Products fetched successfully"));
});

// Remove Product (Updated: using req.params.id)
const removeProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await Product.findById(id);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  await product.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Product removed"));
});

// Single Product Info
const singleProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, product, "Product fetched successfully"));
});

export {
  listProducts,
  addProduct,
  removeProduct,
  singleProduct
};
