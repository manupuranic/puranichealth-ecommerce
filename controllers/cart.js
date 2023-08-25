import User from "../models/user.js";
import Product from "../models/product.js";
import Order from "../models/order.js";

const postCart = async (req, res) => {
  const productId = req.body.productId;
  try {
    const product = await Product.findById(productId);
    await req.user.addToCart(product);
    return res.json({
      message: "Product added to cart",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "something went wrong",
    });
  }
};

const deleteCart = async (req, res) => {
  const productId = req.params.id;
  console.log(productId);
  try {
    await req.user.deleteCartItem(productId);
    return res.json({
      message: "Product deleted from cart",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "something went wrong",
    });
  }
};

const getCart = async (req, res) => {
  try {
    const userDetails = await req.user.populate("cart.productId");
    const products = userDetails.cart;
    return res.json({
      products: products,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "something went wrong",
    });
  }
};

const postOrder = async (req, res) => {
  try {
    const user = await req.user.populate("cart.productId");
    const products = user.cart.map((i) => {
      return { quantity: i.quantity, product: { ...i.productId._doc } };
    });
    const order = new Order({
      user: {
        name: req.user.name,
        userId: req.user,
      },
      products: products,
    });
    await order.save();
    await req.user.clearCart();
    return res.json({
      message: "Order complete",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "something went wrong",
    });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ "user.userId": req.user });
    res.json({
      orders: orders,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "something went wrong",
    });
  }
};

export { postCart, deleteCart, getCart, getOrders, postOrder };
