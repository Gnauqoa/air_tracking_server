import DeviceModel from "../models/device.js";

const sendData = async (socket, device_data) => {
  try {
    const { id } = device_data;
    const device = await DeviceModel.findOne({ device_id: id });
    if (device === null) {
      socket.emit("response", { status: 404, message: "not found" });
      return;
    }
    console.log(device);
  } catch (err) {
    socket.emit(err.message);
  }
};

export { sendData };
