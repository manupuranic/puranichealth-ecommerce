import { Schema, model } from "mongoose";

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  role: {
    type: String,
    required: true,
    default: "customer",
  },
  cart: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
});

userSchema.methods.addToCart = function (product) {
  const existingCart = [...this.cart];
  const cartProductIndex = existingCart.findIndex((p) => {
    return p.productId.toString() === product._id.toString();
  });
  let newquantity = 1;

  if (cartProductIndex >= 0) {
    newquantity = this.cart[cartProductIndex].quantity + 1;
    existingCart[cartProductIndex].quantity = newquantity;
  } else {
    existingCart.push({
      productId: product._id,
      quantity: newquantity,
    });
  }
  this.cart = existingCart;
  return this.save();
};

userSchema.methods.deleteCartItem = function (prodId) {
  const existingCart = this.cart.filter(
    (item) => item.productId.toString() !== prodId.toString()
  );
  console.log(existingCart);
  this.cart = existingCart;
  return this.save();
};

userSchema.methods.clearCart = function () {
  this.cart = [];
  return this.save();
};

export default model("User", userSchema);
