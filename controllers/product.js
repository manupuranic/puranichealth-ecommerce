import Product from "../models/product.js";

const addNewProduct = async (req, res) => {
  const { name, imageUrl, price, desc, category } = req.body;
  const user = req.user;
  if (user.role !== "Admin") {
    return res.status(403).json({
      message: "Unauthorized",
    });
  }
  try {
    const product = await Product.create({
      name: name,
      imageUrl: imageUrl,
      price: price,
      desc: desc,
      category: category,
    });
    return res.json({
      message: "Product created",
      product: product,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "something went wrong",
    });
  }
};

const editProduct = async (req, res) => {
  const { name, imageUrl, price, desc, category } = req.body;
  const _id = req.params.id;
  const user = req.user;
  if (user.role !== "Admin") {
    return res.status(403).json({
      message: "Unauthorized",
    });
  }
  try {
    const product = await Product.findByIdAndUpdate(_id, {
      name: name,
      imageUrl: imageUrl,
      price: price,
      desc: desc,
      category: category,
    });
    return res.json({
      message: "Product updated",
      product: product,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "something went wrong",
    });
  }
};

const deleteProduct = async (req, res) => {
  const _id = req.params.id;
  const user = req.user;
  if (user.role !== "Admin") {
    return res.status(403).json({
      message: "Unauthorized",
    });
  }
  try {
    const product = await Product.findByIdAndDelete(_id);
    return res.json({
      message: "Product deleted",
      product: product,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "something went wrong",
    });
  }
};

const getSingleProduct = async (req, res) => {
  const _id = req.params.id;
  // const user = req.user;
  // if (user.role !== "Admin") {
  //   return res.status(403).json({
  //     message: "Unauthorized",
  //   });
  // }
  try {
    const product = await Product.findById(_id).populate("category");
    return res.json({
      product: product,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "something went wrong",
    });
  }
};

const getProducts = async (req, res) => {
  const category = req.query.category;
  // const user = req.user;
  // if (user.role !== "Admin") {
  //   return res.status(403).json({
  //     message: "Unauthorized",
  //   });
  // }
  try {
    let products;
    if (category === "null") {
      products = await Product.find().populate("category", "name");
    } else {
      products = await Product.find({ category: category }).populate(
        "category",
        "name"
      );
    }
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

export {
  addNewProduct,
  editProduct,
  deleteProduct,
  getProducts,
  getSingleProduct,
};
