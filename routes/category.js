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

categoryRouter.post("/", postNewCategory);

categoryRouter.put("/:id", editCategory);

categoryRouter.get("/", getCategories);

categoryRouter.get("/:id", getSingleCategory);

categoryRouter.delete("/:id", deleteCategory);

export default categoryRouter;
