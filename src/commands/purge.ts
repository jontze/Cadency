import { Role } from ".prisma/client";
import { Command } from "../typings";
import { getGuildId, validateVoiceCommand } from "../utils/discord";

/**
 * Command to clear all songs in the playlist and stop playing music
 */
const Purge: Command = {
  name: "purge",
  description: "Delete all songs in the queue and stop the music!",
  args: false,
  cooldown: 5,
  usage: "",
  aliases: [],
  guildOnly: true,
  permission: Role.MEMBER,
  execute: async (message, args): Promise<void> => {
    validateVoiceCommand(Purge, args, message);
    message.client.emit("purgePlaylist", getGuildId(message), message);
  },
};

export default Purge;
