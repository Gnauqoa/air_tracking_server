import { Schema, model } from "mongoose";

const sensorListSchema = new Schema(
  {
    data: [
      {
        sensor_id: {
          type: String,
          required: true,
        },
        dust: {
          type: Number,
          required: true,
        },
        connected: {
          type: Boolean,
          required: true,
        },
      },
    ],
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);
const recordSchema = new Schema(
  {
    sensor_list: [
      {
        sensor_id: {
          type: String,
          required: true,
        },
        dust: {
          type: Number,
          required: true,
        },
        connected: {
          type: Boolean,
          required: true,
        },
      },
    ],
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);
const deviceSchema = new Schema(
  {
    alert_threshold: {
      type: Number,
      required: true,
      default: 0,
    },
    device_id: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    connected: {
      type: Boolean,
      required: true,
      default: 0,
    },
    sensor_list: sensorListSchema,
    record_history: [recordSchema],
  },
  {
    collection: "device",
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);
const DeviceModel = model("Device", deviceSchema);
export default DeviceModel;
