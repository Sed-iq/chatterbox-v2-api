const SID = "AC7277485cbe3f28c7accc88566b08586f";
const auth_token = "ce272f070565acf4b2c1fdcbf18c538f";
const client = require("twilio")(SID, auth_token);
// const client = require('twilio')(accountSid, authToken);

// client.messages
//   .create({
//     body: "hello",
//     messagingServiceSid: "MGc9166215b7dfee195ee83934e4548db4",
//     to: "+2348115724750",
//   })
//   .then((message) => console.log(message.sid))
//   .done();
// const accountSid = "AC7277485cbe3f28c7accc88566b08586f";
// const authToken = "ce272f070565acf4b2c1fdcbf18c538f";
// const client = require("twilio")(accountSid, authToken);

client.messages
  .create({
    body: "This is chatterbox v2 build by Sadiq",
    from: "whatsapp:+14155238886",
    to: "whatsapp:+2348115724750",
  })
  .then((message) => console.log(message.sid))
  .done();
