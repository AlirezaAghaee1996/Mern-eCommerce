import express from "express";
import { fileURLToPath } from "url";
import path from "path";
import catchError from "./Utils/catchError.js";
import HandleERROR from "./Utils/handleError.js";
import cors from "cors";
import authRouter from "./Routes/Auth.js";
import uploadRouter from "./Routes/Upload.js";
import userRouter from "./Routes/User.js";
import { isLogin } from "./Middlewares/isLogin.js";
import addressRouter from "./Routes/Address.js";
import categoryRouter from "./Routes/Category.js";
import brandRouter from "./Routes/Brand.js";
import sliderRouter from "./Routes/Slider.js";
import variantRouter from "./Routes/Variant.js";
import productRouter from "./Routes/Products.js";
import productVariantRouter from "./Routes/ProductVariant.js";
import commentRouter from "./Routes/Comment.js";
import discountRouter from "./Routes/DiscountCode.js";
import cartRouter from "./Routes/Cart.js";
import searchRouter from "./Routes/Search.js";
import { setupSwagger } from "./swagger/swagger.js";
import orderRouter from "./Routes/Order.js";
import rateRouter from "./Routes/Rate.js";
import reportRouter from "./Routes/Report.js";

const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("Public"));

// Setup Swagger documentation
setupSwagger(app);

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/address', isLogin, addressRouter);
app.use('/api/category', categoryRouter);
app.use('/api/brand', brandRouter);
app.use('/api/slider', sliderRouter);
app.use('/api/variant', variantRouter);
app.use('/api/product', productRouter);
app.use('/api/product-variant', productVariantRouter);
app.use('/api/comment', commentRouter);
app.use('/api/discount', discountRouter);
app.use('/api/order', orderRouter);
app.use('/api/rate', rateRouter);
app.use('/api/report', reportRouter);
app.use('/api/cart', isLogin, cartRouter);
app.use('/api/search', searchRouter);
app.use('/api/upload', uploadRouter);

app.use("*", (req, res, next) => {
  next(new HandleERROR("Route not Found", 404));
});
app.use(catchError);

export default app;
