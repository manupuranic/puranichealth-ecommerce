import { Router } from "express";
import {
  postNewCategory,
  editCategory,
  getCategories,
  deleteCategory,
} from "../controllers/category.js";
import authenticate from "../middlewares/auth.js";

const categoryRouter = Router();

categoryRouter.post("/", postNewCategory);

categoryRouter.put("/:id", editCategory);

categoryRouter.get("/", getCategories);

categoryRouter.delete("/:id", deleteCategory);

export default categoryRouter;
