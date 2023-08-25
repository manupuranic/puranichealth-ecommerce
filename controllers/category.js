import Category from "../models/category.js";

const postNewCategory = async (req, res) => {
  const user = req.user;
  const { name } = req.body;
  if (user.role !== "Admin") {
    return res.status(403).json({
      message: "Unauthorized",
    });
  }
  try {
    const category = await Category.create({
      name: name,
    });
    return res.json({
      message: "Category created",
      category: category,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "something went wrong",
      category: null,
    });
  }
};

const editCategory = async (req, res) => {
  const user = req.user;
  const { name } = req.body;
  const _id = req.params.id;
  if (user.role !== "Admin") {
    return res.status(403).json({
      message: "Unauthorized",
    });
  }
  try {
    const category = await Category.findById(_id);
    category.name = name;
    const updatedCategory = await category.save();
    return res.json({
      message: "Category updated",
      category: updatedCategory,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "something went wrong",
      category: null,
    });
  }
};

const getCategories = async (req, res) => {
  const user = req.user;
  // if (user.role !== "Admin") {
  //   return res.status(403).json({
  //     message: "Unauthorized",
  //   });
  // }
  try {
    const categories = await Category.find();
    return res.json({
      categories: categories,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "something went wrong",
      categories: null,
    });
  }
};

const getSingleCategory = async (req, res) => {
  const _id = req.params.id;
  try {
    const category = await Category.findById(_id);
    return res.json({
      category: category,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "something went wrong",
    });
  }
};

const deleteCategory = async (req, res) => {
  const user = req.user;
  const _id = req.params.id;
  if (user.role !== "Admin") {
    return res.status(403).json({
      message: "Unauthorized",
    });
  }
  try {
    await Category.deleteOne({ _id: _id });
    return res.json({
      message: "Category deleted",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "something went wrong",
    });
  }
};

export {
  postNewCategory,
  editCategory,
  getCategories,
  deleteCategory,
  getSingleCategory,
};
