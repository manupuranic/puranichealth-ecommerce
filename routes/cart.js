import { Router } from "express";
import {
  getCart,
  deleteCart,
  getOrders,
  postCart,
  postOrder,
} from "../controllers/cart.js";
import authenticate from "../middlewares/auth.js";

const cartRouter = Router();

cartRouter.get("/", authenticate, getCart);

cartRouter.post("/", authenticate, postCart);

cartRouter.delete("/:id", authenticate, deleteCart);

cartRouter.get("/order", authenticate, getOrders);

cartRouter.post("/order", authenticate, postOrder);

export default cartRouter;
