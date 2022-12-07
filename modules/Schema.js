const mongoose = require("mongoose");
const Schema = {
  User: mongoose.model(
    "user",
    mongoose.Schema(
      {
        userId: {
          type: Number,
          required: true,
        },
        email: {
          type: String,
        },
        username: {
          type: String,
          required: true,
        },
        password: {
          type: String,
          required: true,
        },
        codes: {
          type: Array,
          required: true,
        },
      },
      { timestamps: true }
    )
  ),
  Link: mongoose.model(
    "link",
    mongoose.Schema(
      {
        code: {
          type: String,
          required: true,
        },
        creator: {
          type: String,
          required: true,
        },
        color:{
          type: String
        },
        chats: {
          type: Array,
        },
        onlineUsers:{
          type:Array // Quick access data type
        }
      },
      { timestamps: true }
    )
  ),
};
module.exports = Schema;
