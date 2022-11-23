const Schema = require("./Schema");
const jwt = require("jsonwebtoken");
const Controller = {
  dashboard: (req, res) => {
    Schema.User.findOne({ userId: req.userId }).then((data) => {
      if (data == null || data == "undefined")
        sendERR(res, "Error getting user info try reloading site");
      else
        res.json({
          auth: true,
          data: {
            username: data.username,
            email: data.email,
            links: data.codes,
          },
        });
    });
  },
  generateLink: (req, res) => {
    let id = req.userId;
    let newCode = randomGen(6);
    Schema.User.findOneAndUpdate({ userId: id }, { $push: { codes: newCode } })
      .then((d) => {
        try {
          if (d !== "") {
            let code = new Schema.Link({
              code: newCode,
              userId: req.userId,
              chats: [],
            });
            code.save().then(() => res.json({ auth: true, newCode }));
          } else sendERR(res, "Error generating link");
        } catch (error) {
          console.log(error);
          sendERR(res, "Error indexing database");
        }
      })
      .catch((err) => {
        console.log(err);
        sendERR(res, "Error generating link");
      });
  },
  deleteLink: (req, res) => {
    let { code } = req.body;
    Schema.Link.deleteOne({ code })
      .then((d) => {
        if (d.deletedCount == 1) {
          // Clear link from user code array
          Schema.User.findOne({ userId: req.userId }).then((data) => {
            if (data !== "") {
              let newlink = data.codes.filter((c) => c != code);
              Schema.User.updateOne(
                { userId: req.userId },
                { codes: newlink }
              ).then((c) => {
                if (c.acknowledged == true) res.json({ auth: true });
                else sendERR(res, "Error deleting link");
              });
            } else sendERR(res, "Error deleting link");
          });
        } else sendERR(res, "Error deleting link");
      })
      .catch((err) => sendERR(res, "Error deleting link"));
  },
  deleteAcc: (req, res) => {
    const userId = req.userId;
    console.log(userId);
    Schema.User.findOneAndDelete({ userId })
      .then((data) => {
        if (data == "") sendERR(res, "Not found");
        else {
          const codes = data.codes;
          Schema.Link.deleteMany({ code: codes }).then((d) => {
            if (d.acknowledged == true) res.json({ auth: true });
            else sendERR(res, "Error deleting ");
          });
        }
      })
      .catch((e) => sendERR(res, "Error deleting"));
  },

  getChats: (req, res) => {
    const { userId } = req;
    Schema.User.findOne({ userId }, (err, da) => {
      if (err) sendERR(res, "Error finding chats");
      else {
        const { codes } = da;
        res.json({ auth: true, links: codes });
      }
    });
  },
  chatInit: (req, res) => {
    var $ = req.headers["x-token"];
    let { code } = req.params; // Anonymous code
    var $token = JSON.parse($); // Both access tokens and senders token
    const new_tokens = {
      // To be given to new user upon identification of not access
      link: code,
      sender_id: randomGen(5),
    };
    Schema.Link.findOne({ code }, (err, d) => {
      if (d == "" || d === null || err) {
        res.status(404).end();
      }
      //  else {
      //     if ($token == "undefined" || $token == null) {
      //       let token = jwt.sign({ tokens }, "secret", {
      //         expiresIn: "100hrs",
      //       });
      //       res.json({ token, auth: false }); // Because user was not initially autorized
      //     } else {
      //       res.json({ auth: true, token: $token });
      //     }
      //   }
    });
  },
};

function sendERR(res, message) {
  res.json({ auth: false, message: message });
}
function randomGen(range) {
  let strNum = "";
  let arrNum = [];
  for (let i = 0; i < range; i++) {
    let number = Math.floor(Math.random() * 5);
    arrNum.push(number);
  }
  arrNum.forEach((num) => {
    strNum += num;
  });
  return strNum;
}
async function verifyJwt(token) {
  if (token) {
    await jwt.verify(token, "secret", (err, unhash) => {
      if (err) {
        return {
          auth: false,
        };
      } else {
        return "hello";
        //   auth: true,
        //   data: unhash,
      }
    });
  } else {
    return {
      auth: false,
    };
  }
}
module.exports = Controller;
// if (action.auth == true) console.log("Verified token present");
// else console.log(action.auth);
// use(async (socket, next) => {
//   const token = socket.handshake.auth.token;
//   next();
//   // Verifying token
//   // jwt.verify(token, "secret", async (err, decoded) => {
//   //   if (err) next(new Error("Thou shall not pass"));
//   //   else {
//   //     await Schema.Link.findOne({ code: decoded.tokens.link }, (err, d) => {
//   //       if (err) {
//   //         next(new Error("Not Found"));
//   //       } else if (d == null) {
//   //         next(new Error("Error"));
//   //       } else {
//   //         linkData = d.code;
//   //         next();
//   //       }
//   //     });
//   //   }
//   // });
// })
