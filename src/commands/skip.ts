import { Role } from ".prisma/client";
import { Command } from "../typings";
import { getGuildId, validateVoiceCommand } from "../utils/discord";

/**
 * Command to skip the current playing song in the playlist
 */
const Skip: Command = {
  name: "skip",
  description: "Skip to the next song in the queue!",
  args: false,
  cooldown: 10,
  usage: "",
  aliases: [],
  guildOnly: true,
  permission: Role.MEMBER,
  execute: async (message, args): Promise<void> => {
    validateVoiceCommand(Skip, args, message);
    message.client.emit("skipSong", getGuildId(message), message);
  },
};

export default Skip;
