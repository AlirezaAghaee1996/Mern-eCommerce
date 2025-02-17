import express from "express";
import { fileURLToPath } from "url";
import path from "path";
import catchError from "./Utils/catchError.js";
import HandleERROR from "./Utils/handleError.js";
import cors from "cors";

const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("Public"));


app.use("*", (req, res, next) => {
  next(new HandleERROR("Route not Found", 404));
});
app.use(catchError);

export default app;
