import { Router } from "express";
import {
  postSignupUser,
  postLoginUser,
  getUsers,
} from "../controllers/user.js";
import authenticate from "../middlewares/auth.js";

const userRouter = Router();

userRouter.post("/signup", postSignupUser);

userRouter.post("/login", postLoginUser);

userRouter.get("/", authenticate, getUsers);

export default userRouter;
