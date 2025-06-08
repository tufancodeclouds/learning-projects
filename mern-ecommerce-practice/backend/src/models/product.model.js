import mongoose, { Schema } from "mongoose";

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },
    image: {
      type: [String], // array of strings
      required: [true, "At least one product image is required"],
      validate: [(val) => val.length > 0, "Provide at least one image"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    subCategory: {
      type: String,
      required: [true, "Subcategory is required"],
      trim: true,
    },
    sizes: {
      type: [String], // array of strings
      required: [true, "Sizes are required"],
      validate: [(val) => val.length > 0, "At least one size must be provided"],
    },
    bestseller: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Product = mongoose.models.Product || mongoose.model("Product", productSchema);
