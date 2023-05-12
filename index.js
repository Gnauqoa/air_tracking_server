import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import {} from "dotenv/config";
import router from "./src/routers/index.js";
import http from "http";
import { Server } from "socket.io";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { DeviceModel } from "./src/models/index.js";
import pageRouter from "./src/pageRouter/index.js";
import { sendData } from "./src/socketIO/device.js";

const port = process.env.PORT || 4000;
const database = process.env.DATABASE_URL;
const app = express();
const version = "/v1";
const server = http.createServer(app);
const io = new Server(server);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(pageRouter);
app.use(version, router);
mongoose.set("strictQuery", false); // hide notify in console

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});
server.listen(port, () => {
  console.log(`start server at port: ${port}`);
  mongoose
    .connect(database)
    .then((result) => {
      // const device = new DeviceModel({
      //   device_id: "252",
      //   password: "device",
      //   sensor_list: [
      //   { sensor_id: "252", dust: 12.52, connected: false } ,
      //   ],
      // });
      // device.save();
      console.log(`connect database with url: ${database}`);
    })
    .catch((err) => console.log(err));
});
io.on("connection", (socket) => {
  console.log("A client connected.", socket.id);
  socket.on("device_send_data", (device_data) => sendData(socket, device_data));
  socket.on("disconnect", () => {
    console.log("A client disconnected.");
  });
});
