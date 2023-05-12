import express from "express";
import { updateDeviceData } from "../controller/device/index.js";
import deviceAuth from "../middleware/deviceAuth.js";

const deviceRouter = express.Router();

deviceRouter.put("/device", deviceAuth, updateDeviceData);

export default deviceRouter;
