import bcrypt from "bcrypt";
import User from "../models/user.js";
import JWT from "jsonwebtoken";

const generateJWT = (email, _id, role, name) => {
  return JWT.sign(
    { email: email, _id: _id, role: role, name: name },
    process.env.JWT_SECRET_KEY
  );
};

const postSignupUser = async (req, res) => {
  const { name, email, password, phone } = req.body;
  try {
    const existingUser = User.find({ email: email });
    console.log(existingUser);
    if (existingUser.length) {
      return res.status(403).json({
        message: "user Already exist",
      });
    }
    bcrypt.hash(password, 10, async (err, hash) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          message: "Something went wrong",
        });
      }
      const user = await User.create({
        name: name,
        email: email,
        password: hash,
        phone: phone,
        role: "Customer",
      });
      return res.json({
        user: user,
        message: "Successfully created user",
      });
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      user: null,
      message: "Something went wrong",
    });
  }
};

const postLoginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    const result = await bcrypt.compare(password, user.password);
    console.log(result);
    if (result) {
      return res.json({
        token: generateJWT(user.email, user._id, user.role, user.name),
        message: "Login successful",
      });
    } else {
      return res.status(404).json({
        message: "Incorrect Password",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "something went wrong",
    });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    return res.json({
      users: users,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "something went wrong",
    });
  }
};

export { postSignupUser, postLoginUser, getUsers };
