const http = require("http");
const express = require("express");
const app = express();
const path = require("path");
const server = http.createServer(app);
const dotenv = require("dotenv").config();
const router = require(path.join(__dirname + "/modules/router.js"));
const mongoose = require("mongoose");
const URL = process.env.DB_URL;
// const Schema = require("./modules/Schema");
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});
app.use(router);
mongoose.connect(URL, (err) => {
  if (err) throw err;
  else {
    server.listen(process.env.PORT, console.log("Server is running"));
  }
});

// io.on("connection", (socket) => {
//   let payload = socket.handshake.auth.$token;
//   socket.emit("thru", true);
//   socket.on("join", async(link, cb) => {
//     // Checking users
//     Schema.Link.findOne({ code: link }, (err, d) =>{
//       if(err || d == " ") cb(false, false)
//       else {
//         if(d.onlineUsers.length < 2){
//           if(d.onlineUsers.includes(payload)){
//             cb(true, true)
//           }
//           else {
//             // Adding user
//             d.onlineUsers.unshift(payload)
//             Schema.Link.findOneAndUpdate({ code:link }, { onlineUsers:d.onlineUsers } ,(err,x)=>{
//               if(err|| x =='') cb(false, false)
//                 else {
//                   if(x.onlineUsers.length == 1) cb(true, true)
//                     else cb(true, false)
//                 }
//             })
//           }
//         }
//         else cb(false, false)
//       }
//     })
//        socket.join(link);
//   socket.broadcast.to(link).emit('online', true)
//        socket.on("message", (m, cb) => {
//        m.date = new Date()
//        socket.broadcast.to(link).emit("broadcast", m);
//        cb(m);
//       });
//   });
//   socket.on("disconnect", (data) => {
//  const $link = socket.handshake.auth.$link
//   Schema.Link.findOne({ code:$link })
//   .then(x => {
//       if(x == "") console.log('user not found')
//         else {
//           let n = x.onlineUsers.filter(c => c !== payload)
//           Schema.Link.findOneAndUpdate({ code : $link}, { onlineUsers: n }, (err) =>{
//             if(err) console.log(err)
//               else {
//               socket.broadcast.to($link).emit('online', false)
//           }
//           })
//         }
//   })
// .catch(e =>{
//   console.log("Ending", e)
// })
//   });
// });
