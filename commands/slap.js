module.exports = {
  name: "slap",
  description: "Slap someone with a large trout!",
  args: true,
  guildOnly: true,
  usage: "<@PlayerName>",
  execute(message, args) {
    return message.channel.send(`${message.author} slaps ${args[0]} around a bit with a large trout!`)
  },
};
