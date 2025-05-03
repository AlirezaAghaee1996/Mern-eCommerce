import mongoose from "mongoose";
const itemSchema = new mongoose.Schema({
  quantity: {
    type: Number,
  },
  finalPrice: {
    type: Number,
  },
  ProductId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  ProductVariantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProductVariant",
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
},{_id:false});
const orderSchema = new mongoose.Schema(
  {
    totalPrice: {
      type: Number,
    },
    totalPriceAfterDiscount: {
      type: Number,
    },
    discountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DiscountCode",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    addressId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
    },
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
    authority: {
      type: String,
    },
    items: {
      type: [itemSchema],
    },
    refId: {
      type: String,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
