import multer from "multer";
import path from "path";

import { __dirname } from "./../app.js";



// Configure the storage location and file naming for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname+'/Public'); // Use the publicDir variable
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage: storage });

export default upload;