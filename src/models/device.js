import { ObjectId } from "mongodb";
import { Schema, model } from "mongoose";

const sensorSchema = new Schema(
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
      },
    ],
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);
const deviceSchema = new Schema(
  {
    device_id: {
      type: String,
      required: true,
      unique: true,
    },
    connected: {
      type: Boolean,
      required: true,
      default: 0,
    },

    sensor_list: [
      {
        sensor: {
          type: sensorSchema,
          required: true,
        },
      },
    ],
    record_history: [
      {
        record: {
          type: recordSchema,
          required: true,
        },
      },
    ],
  },
  {
    collection: "device",
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);
const DeviceModel = model("Device", deviceSchema);
export default DeviceModel;
