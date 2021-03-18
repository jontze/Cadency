import { Command } from "../typings";

const Now: Command = {
  name: "now",
  description: "Show current song.",
  args: false,
  cooldown: 5,
  usage: "",
  aliases: [],
  guildOnly: true,
  execute(message, args) {
    const voiceChannelUser = message.member?.voice.channel;

    message.client.emit("currentSong", voiceChannelUser?.guild.id, message);
  },
};

export default Now;
