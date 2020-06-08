module.exports = {
  name: "ping",
  description: "Ping-Pong!",
  cooldown: 5,
  execute(message, args) {
    message.channel.send("Pong");
  },
};
