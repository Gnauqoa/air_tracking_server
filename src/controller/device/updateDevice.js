import { DeviceModel } from "../../models/index.js";
import dayjs from "dayjs";

const updateDeviceData = async (req, res, next) => {
  try {
    const { device } = req;
    const { device_id, data } = req.body;
    let { sensor_list, alert_threshold } = data;
    if (!sensor_list) {
      const new_device = await DeviceModel.findOneAndUpdate(
        { device_id: device_id },
        {
          $set: { alert_threshold: alert_threshold },
        }
      );
      res.status(200).json({ message: "update success" });
      return;
    }
    console.log( device_id, data);
    if (!alert_threshold) alert_threshold = device.alert_threshold;
    const old_data = device.sensor_list.data.map((sensor, index) => ({
      dust: sensor.dust,
      connected: sensor.connected,
      sensor_id: sensor.sensor_id,
    }));
    const new_device = await DeviceModel.findOneAndUpdate(
      { device_id: device_id },
      {
        $set: {
          alert_threshold: alert_threshold,
          sensor_list: { data: sensor_list },
        },
        $push: {
          record_history: { sensor_list: old_data },
        },
      }
    );
    global._io.emit("new_device_data", {
      data: {
        updated_at: dayjs(),
        sensor_list: sensor_list,
      },
    });
    res.status(200).json({
      message: "update success",
      data: { alert_threshold: alert_threshold },
    });
  } catch (err) {
    next(err);
  }
};

export default updateDeviceData;
