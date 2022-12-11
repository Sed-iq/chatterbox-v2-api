const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const URI = process.env.DB_URL;
mongoose.connect(URI, (err) => {
  if (err) throw err;
  else {
    console.log("db connected(socket)");
    const io = require("socket.io")(3001, {
      cors: {
        origin: "*",
      },
    });
    io.on("connection", (socket) => {
      socket.on("write", (m) => {
        console.log(m);
      });
    });
  }
});
