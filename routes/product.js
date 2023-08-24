import { Router } from "express";
import {
  addNewProduct,
  deleteProduct,
  editProduct,
  getProducts,
  getSingleProduct,
} from "../controllers/product.js";
import authenticate from "../middlewares/auth.js";

const productRouter = Router();

productRouter.post("/", addNewProduct);

productRouter.put("/:id", editProduct);

productRouter.get("/", getProducts);

productRouter.get("/:id", getSingleProduct);

productRouter.delete("/:id", deleteProduct);

export default productRouter;
