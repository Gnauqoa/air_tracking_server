import { DeviceModel } from "../../models/index.js";

const updateDeviceData = async (req, res, next) => {
  const { device } = req;
  const { device_id, data } = req.body;
  const { sensor_list } = data;
  const old_data = device.sensor_list.map((sensor, index) => ({
    dust: sensor.dust,
    connected: sensor.connected,
    sensor_id: sensor.sensor_id,
  }));
  const new_device = await DeviceModel.findOneAndUpdate(
    { device_id: device_id },
    {
      $set: { sensor_list: sensor_list },
      $push: {
        record_history: { sensor_list: old_data },
      },
    }
  );
  res.status(200).json({ message: "update success" });
};

export default updateDeviceData;
