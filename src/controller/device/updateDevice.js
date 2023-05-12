import { DeviceModel } from "../../models/index.js";

const updateDeviceData = async (req, res) => {
  try {
    const { device } = req;
    const { device_id, data } = req.body;
    const { sensor_list } = data;
    const old_data = device.sensor_list.map((sensor, index) => ({
      dust: sensor.dust,
      connected: sensor.connected,
      sensor_id: sensor.sensor_id,
    }));
    await DeviceModel.findOneAndUpdate(
      { device_id: device_id },
      {
        $set: { sensor_list: sensor_list },
        $push: {
          record_history: { sensor_list: old_data },
        },
      }
    );
    res.status(200).json({ message: "update success" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export default updateDeviceData;
