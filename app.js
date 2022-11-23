const http = require("http");
const express = require("express");
const app = express();
const server = http.createServer(app);
const router = require("./modules/router");
const mongoose = require("mongoose");
const Controller = require("./modules/Controller");
const URL = "mongodb://127.0.0.1/chatterbox";
const socket = require("socket.io");
const Schema = require("./modules/Schema");
const jwt = require("jsonwebtoken");
const io = new socket.Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});
mongoose.connect(URL, (err) => {
  if (err) throw err;
  else server.listen(5000, console.log("Server on port 5000"));
});
app.use(router);
// Handling socket jobs
io.use().on("connection", (socket) => {
  socket.on("join", (link) => {
    socket.join(link);
    socket.on("message", (msg, cb) => {
      socket.broadcast.to(link).emit("msg", msg);
      cb(msg);
    });
  });
});
