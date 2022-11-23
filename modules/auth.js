const jwt = require("jsonwebtoken");
const Schema = require("./Schema");
const bcrypt = require("bcryptjs");
const Auth = {
  register: async (req, res) => {
    let { username, email, password } = req.body;
    bcrypt
      .hash(password, 10)
      .then((result) => {
        let user = new Schema.User({
          username,
          email,
          userId: randomGen(6),
          password: result,
        });
        user
          .save()
          .then(() => res.json({ auth: true }))
          .catch((e) => sendERR(res, "Error Saving"));
      })
      .catch((err) => {
        sendERR(res, "Error securing register");
      });
  },
  login: async (req, res) => {
    let { username, password } = req.body;
    // Checking password and username comparing has with data string
    await Schema.User.findOne({ username: username })
      .then((data) => {
        if (data == null || data == "") {
          sendERR(res, "User not found");
        } else {
          bcrypt
            .compare(password, data.password)
            .then((result) => {
              if (result === true) {
                let id = data.userId;
                let token = jwt.sign({ id }, "secret", {
                  expiresIn: "15hrs",
                });
                res.json({ auth: true, token });
              } else sendERR(res, "Wrong password");
            })
            .catch((err) => sendERR(res, "Password does not match"));
        }
      })
      .catch((err) => {
        console.log(err);
        sendERR(res, "Database Erorr");
      });
  },
  jwtVerify: (req, res, next) => {
    const token = req.headers["x-access-token"];
    if (token == "undefined" || token == null) {
      next();
    } else {
      // Verifies token
      jwt.verify(token, "secret", (err, decoded) => {
        if (err) {
          next();
        } else {
          req.userId = decoded.id;
          res.json({ auth: true });
        }
      });
    }
  },

  viewAuth: (req, res, done) => {
    // To check if the register and login routes are to be viewed
    const token = req.headers["x-access-token"];
    if (token == "undefined" || token == null) {
      res.json({
        auth: false,
      });
    } else {
      jwt.verify(token, "secret", (err, decoded) => {
        if (err) {
          res.json({ auth: false, message: "Error validating" });
        } else {
          req.userId = decoded.id;
          if (
            req.url == "/dashboard" ||
            req.url == "/generate" ||
            req.url == "/code" ||
            req.url == "/delete" ||
            req.url == "/showChats"
          )
            done();
          else res.json({ auth: true });
        }
      });
    }
  },
};
function sendERR(res, message) {
  res.json({ auth: false, message: message });
}
function randomGen(range) {
  let strNum = "";
  let arrNum = [];
  for (let i = 0; i < range; i++) {
    let number = Math.floor(Math.random() * 8);
    arrNum.push(number);
  }
  arrNum.forEach((num) => {
    strNum += num;
  });
  return strNum;
}

module.exports = Auth;
