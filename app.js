const http = require("http");
const express = require("express");
const app = express();
const server = http.createServer(app);
const router = require("./modules/router");
const mongoose = require("mongoose");
const Controller = require("./modules/Controller");
const URL = "mongodb://127.0.0.1/chatterbox";
const Schema = require("./modules/Schema");
const jwt = require("jsonwebtoken");
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

app.use(router);
mongoose.connect(URL, (err) => {
  if (err) throw err;
  else {
    server.listen(5000, console.log("Server on port 5000"));
  }
});
// Handling socket jobs
// io.use((socket, next) => {
//   let $token = socket.handshake.auth;
//   if ($token.senderToken) {
//     jwt.verify($token.senderToken, "secret", (err, decoded) => {
//       if (err) console.log(err);
//       else {
//         if ($token.accessToken) {
//           // console.log("Logged in");
//           next();
//         } else {
//           // Not logged in
//           next();
//         }
//       }
//     });
//   } else {
//     next(new Error("Thou shall not pass"));
//   }
// });

// socket.on("join", async (link) => {
//   // Fetching chats
//   socket.emit("chats", []);
//   socket.on("message", (msg) => {
//     console.log(msg);
//   });
// await Schema.Link.findOne({ code: link }, (err, d) => {
//   if (err || d == "" || d == null) {
//     console.log("Nut found");
//   } else {
//     let { chats, creator } = d;
//     socket.emit("chats", chats);
//     socket.join(link);
//     socket.on("message", (msg) => {
//       console.log(msg);
//       // console.log(cb);
//     });
//   }
// });
// });
// });
io.on("connection", (socket) => {
  socket.on("join", (link) => {
    socket.join(link);
    socket.on("message", (m, cb) => {
      socket.broadcast.to(link).emit("message", m.message);
      cb(m.message);
    });
  });
});
