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
    origin: "http://localhost:3000",
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
