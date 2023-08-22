import { Router } from "express";
import {
  addNewProduct,
  deleteProduct,
  editProduct,
  getProducts,
} from "../controllers/product.js";
import authenticate from "../middlewares/auth.js";

const productRouter = Router();

productRouter.post("/", addNewProduct);

productRouter.put("/:id", editProduct);

productRouter.get("/", getProducts);

productRouter.delete("/:id", deleteProduct);

export default productRouter;
