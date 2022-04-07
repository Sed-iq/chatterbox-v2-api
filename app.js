const http = require("http");
const express = require("express");
const app = express();
const server = http.createServer(app);
const router = require("./modules/router");
const mongoose = require("mongoose");
const URL = "mongodb://127.0.0.1/chatterbox";
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});
let users = [];
app.use(router);
mongoose.connect(URL, (err) => {
  if (err) throw err;
  else {
    server.listen(5000);
  }
});

io.on("connection", (socket) => {
  socket.emit("thru", true);
  socket.on("join", (link, cb) => {
    // Checking users
    let payload = socket.handshake.auth.$token;
    if (payload !== null) {
      if (users.includes(payload)) cb(true);
      else if (users.length > 2) cb(false);
      else {
        users.push(payload);
        cb(true);
      }
      socket.join(link);
      socket.on("message", (m, cb) => {
        socket.broadcast.to(link).emit("broadcast", m);
        cb(m);
      });
    } else cb(false);
  });
  socket.on("disconnect", (data) => {
    let payload = socket.handshake.auth.$token;
    if (users.includes(payload) === true) {
      let r = users.filter((c) => c != payload);
      users = r;
    }
  });
});
