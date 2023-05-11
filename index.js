import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import {} from "dotenv/config";
import router from "./src/routers/index.js";
import http from "http";
import { Server } from "socket.io";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import pageRouter from "./src/pageRouter/index.js";

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
app.use(version, router);
app.use(express.static(join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(pageRouter);

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
      console.log(`connect database with url: ${database}`);
    })
    .catch((err) => console.log(err));
});
const clients = {};
io.on("connection", (socket) => {
  console.log("A client connected.");
  socket.on("device_send_data", (clientId) => {
    clients[clientId] = socket;
    console.log(`Client ${clientId} registered.`);
    socket.emit("message", "hello");
  });
  socket.on("disconnect", () => {
    console.log("A client disconnected.");
  });
});
