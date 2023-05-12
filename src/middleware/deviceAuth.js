import DeviceModel from "../models/device.js";

const deviceAuth = async (req, res, next) => {
  try {
    const { password, device_id } = req.body;
    const device = await DeviceModel.findOne({ device_id, password });
    if (device === null) {
      res.status(401).json({
        message: "Unauthorized",
      });
      return;
    }
    req.device = device;
    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export default deviceAuth;
