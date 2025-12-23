import multer from "multer";
import DataParser from "datauri/parser.js";
import path from "path";

const storage = multer.memoryStorage();

const uploads = multer({
  storage,
});
const parser = new DataParser();
export const formatImage = (file) => {
  const fileExt = path.extname(file.originalname).toString();
  return parser.format(fileExt, file.buffer).content;
};

export default uploads;
