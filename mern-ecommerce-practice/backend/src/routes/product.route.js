import { Router } from "express";
import {
  listProducts,
  addProduct,
  removeProduct,
  singleProduct
} from "../controllers/productController.js";
import { adminAuthenticate } from "../middlewares/adminAuthenticate.middleware.js";

const productRouter = Router();

productRouter.route("/").get(listProducts);

productRouter.route("/").post(adminAuthenticate, addProduct);

productRouter.route("/:productId").get(singleProduct);

productRouter.route("/:id").delete(adminAuthenticate, removeProduct);

export default productRouter;
