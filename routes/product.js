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

productRouter.post("/", authenticate, addNewProduct);

productRouter.put("/:id", authenticate, editProduct);

productRouter.get("/", getProducts);

productRouter.get("/:id", getSingleProduct);

productRouter.delete("/:id", authenticate, deleteProduct);

export default productRouter;
