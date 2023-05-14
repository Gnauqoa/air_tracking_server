import { DeviceModel } from "../../models/index.js";

const getDeviceData = async (socket) => {
  try {
    const device = await DeviceModel.findOne({ device_id: 252 });
    socket.emit("new_device_data", {
      data: {
        updated_at: device.updated_at,
        sensor_list: device.sensor_list,
      },
    });
  } catch (err) {
    console.log(err.message);
  }
};

export default getDeviceData;
