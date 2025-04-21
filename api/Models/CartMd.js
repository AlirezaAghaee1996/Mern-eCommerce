import mongoose from "mongoose";
const itemSchema = new mongoose.Schema(
  {
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    productVariantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductVariant",
    },
    finalPrice: {
      type: Number,
    },
    quantity: {
      type: Number,
      default: 1,
    },
  },
  { _id: false }
);
const cartSchema = new mongoose.Schema({
  items: {
    type: [itemSchema],
    default: [],
  },
  totalPrice: {
    type: Number,
    default: 0,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});
const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
