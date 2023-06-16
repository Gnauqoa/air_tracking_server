import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import {} from "dotenv/config";
import router from "./src/routers/index.js";
import http from "http";
import { Server } from "socket.io";
import SocketService from "./src/service/socket.js";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const port = process.env.PORT || 4000;
const database = process.env.DATABASE_URL;
const app = express();
const server = http.createServer(app);
const io = new Server(server);

const __dirname = dirname(fileURLToPath(import.meta.url));

global.__basedir = __dirname;
global._io = io;

app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(join(__basedir, "public")));
app.use(router);
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});
mongoose.set("strictQuery", false);

server.listen(port, () => {
  console.log(`start server at port: ${port}`);
  mongoose
    .connect(database)
    .then((result) => console.log(`connect database with url: ${database}`))
    .catch((err) => console.log(err));
});
io.on("connection", SocketService.connection);
