import Cart from "../Models/CartMd";
import ProductVariant from "../Models/ProductVariantMd.js";
import catchAsync from "../Utils/catchAsync.js";

export const add = catchAsync(async (req, res, next) => {
  const { productVariantId, productId, categoryId } = req?.body;
  let add = false;
  const pr = await ProductVariant.findById(productVariantId);
  const userId = req.userId;
  const cart = await Cart.findOne({ userId });
  cart.items = cart.items.map((item) => {
    if (item.productVariantId.toString() == productVariantId) {
      item.quantity = item.quantity + 1;
      cart.totalPrice = cart.totalPrice + item.finalPrice;
      add = true;
    }
    return item;
  });
  if (!add) {
    cart.items.push({
      productVariantId,
      productId,
      categoryId,
      quantity: 1,
      finalPrice: pr.priceAfterDiscount,
    });
    cart.totalPrice += +pr.priceAfterDiscount;
  }
  const newCart = await cart.save();
  return res.status(200).json({
    success: true,
    data: newCart,
    message: "add to cart successfully",
  });
});
export const remove = catchAsync(async (req, res, next) => {
  const { productVariantId } = req?.body;
  const userId = req.userId;
  const cart = await Cart.findOne({ userId });
  cart.items = cart.items.filter((item) => {
    if (item.productVariantId.toString() == productVariantId) {
      item.quantity = item.quantity - 1;
      cart.totalPrice = cart.totalPrice - item.finalPrice;
      if (item.quantity == 0) {
        return false;
      }
    }
    return item;
  });
  const newCart = await cart.save();
  return res.status(200).json({
    success: true,
    data: newCart,
    message: "item removed successfully",
  });
});
export const clear = catchAsync(async (req, res, next) => {
  const userId = req.userId;
  const cart = await Cart.findOneAndUpdate(
    { userId },
    { items: [], totalPrice: 0 },
    { new: true, runValidators: true }
  );
  return res.status(200).json({
    success: true,
    data: cart,
    message: "cart is clear",
  });
});
export const getUserCart = catchAsync(async (req, res, next) => {
  const userId = req.userId;
  const cart = await Cart.findOne({ userId });
  return res.status(200).json({
    success: true,
    data: cart,
  });
});
