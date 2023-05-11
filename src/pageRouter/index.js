import express from "express";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const pageRouter = express.Router();

pageRouter.get("/", (req, res) => {
  res.render(join(__dirname, "../views", "index.ejs"));
});

export default pageRouter;
