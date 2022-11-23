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
          required: true,
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
        userId: {
          type: String,
          required: true,
        },
        chats: {
          type: Array,
        },
      },
      { timestamps: true }
    )
  ),
};
module.exports = Schema;
