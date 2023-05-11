import DeviceModel from "../models/device.js";

const sendData = async (data) => {
  try {
    const { id } = data.id;
    const device = DeviceModel.findById(id);
  } catch (err) {
    console.log(err.message);
  }
};

export { sendData };
