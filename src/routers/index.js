import express from "express";
import deviceRouter from "./device.js";

const router = express.Router();
router.use(deviceRouter);

export default router;
