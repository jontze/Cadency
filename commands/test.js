module.exports = {
  name: "test",
  description: "Test the Bot!",
  args: true,
  usage: "<radnomString>",
  guildOnly: true,
  execute(message, args) {
    if (args[0]) {
      return message.channel.send("Testing...works!");
    }
  },
};
