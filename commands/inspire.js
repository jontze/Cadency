const fetch = require('node-fetch');

module.exports = {
  name: "inspire",
  description: "Say something really inspiring!",
  cooldown: 5,
  usage: "",
  execute(message, args) {
    fetch("https://inspirobot.me/api?generate=true")
    .then(result => result.text())
    .then(pic_url => {
      return message.channel.send(pic_url);
    })
    .catch(err => {
      console.log(err);
      return message.channel.send("Internal error :(((. Shit just hits the fan...");
    })
  },
};
