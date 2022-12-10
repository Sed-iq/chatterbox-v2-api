const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const Auth = require("./auth");
const Controller = require("./Controller");
const session = require("express-session");
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser());
app.use(
  cors({
    origin: "https://chatterbox-v2.vercel.app",
    credentials: true,
  })
);
app.use(
  session({
    secret: "secret",
    saveUninitialized: false,
    resave: true,
  })
);
app.get("/", ({}, res) => {
  res.send(`Chatterbox v2 api, 
  Routes: 
  /validate
  /showChats
  /anon/:code
  /dashboard 
  /generate
  /login
  /register/
  /code
  /delete
  /savechat
  `);
});
app.post("/validate", Auth.viewAuth);
app.post("/showChats", Auth.viewAuth, Controller.getChats);
app.post("/anon/:code", Controller.chatInit); // Gets all chats of a single link
app.post("/dashboard", Auth.viewAuth, Controller.dashboard);
app.put("/generate", Auth.viewAuth, Controller.generateLink);
app.put("/code", Auth.viewAuth, Controller.deleteLink);
app.post("/login", Auth.jwtVerify, Auth.login);
app.post("/register", Auth.jwtVerify, Auth.register);
app.post("/saveChat", Controller.saveChat);
app.delete("/delete", Auth.viewAuth, Controller.deleteAcc);
// Returns chats in a json format
// app.post("/chats/:id")
module.exports = app;
