import User from "../models/user.js";
import jwt from "jsonwebtoken";

const authenticate = async (req, res, next) => {
  const token = req.header("Authentication");
  if (!token) {
    console.log("no token found");
    return res.status(403).json({
      message: "Unauthorized, token missing",
    });
  }
  try {
    const tokenData = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findById(tokenData._id);
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export default authenticate;
