import { Role } from ".prisma/client";
import { Command } from "../typings";
import { getGuildId, validateVoiceCommand } from "../utils/discord";

/**
 * Command to list all songs in the playlist
 */
const Show: Command = {
  name: "show",
  description: "Show all songs in the queue!",
  args: false,
  cooldown: 5,
  usage: "",
  aliases: [],
  guildOnly: true,
  permission: Role.MEMBER,
  execute: async (message, args): Promise<void> => {
    validateVoiceCommand(Show, args, message);
    message.client.emit("showPlaylist", getGuildId(message), message);
  },
};

export default Show;
