import express from "express";
import deviceRouter from "./device.js";
import { join } from "path";

const version = "/v1";
const router = express.Router();

router.use(version, deviceRouter);
router.get("/", (req, res) => {
  res.render(join(global.__basedir, "src/views", "home.ejs"));
});
router.get("/test", (req, res, next) => {
  res.status(200).send("OK");
 
});
export default router;
