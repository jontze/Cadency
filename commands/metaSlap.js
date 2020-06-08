const {MessageAttachment} = require('discord.js');
const trout_gifs = [
  "https://tenor.com/view/fish-slap-strong-wave-shut-up-stfu-gif-9199351",
  "https://tenor.com/view/smack-slap-fish-face-fail-gif-4653568",
  "https://tenor.com/view/fish-slap-gif-14082649",
];

module.exports = {
  name: "meta-slap",
  description: "A new level of trout-slapping...",
  args: true,
  guildOnly: true,
  cooldown: 4,
  aliases: ["mslap"],
  usage: "<@PlayerName>",
  execute(message, args) {
    message.channel.send(trout_gifs[Math.floor(Math.random() * trout_gifs.length - 0.01)]);
    message.channel.send(`${message.author} slapped ${args[0]} so hard that he is now unconscious!`);
  },
};
