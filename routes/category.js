import { Router } from "express";
import {
  postNewCategory,
  editCategory,
  getCategories,
  deleteCategory,
  getSingleCategory,
} from "../controllers/category.js";
import authenticate from "../middlewares/auth.js";

const categoryRouter = Router();

categoryRouter.post("/", authenticate, postNewCategory);

categoryRouter.put("/:id", authenticate, editCategory);

categoryRouter.get("/", getCategories);

categoryRouter.get("/:id", getSingleCategory);

categoryRouter.delete("/:id", authenticate, deleteCategory);

export default categoryRouter;
