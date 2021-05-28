import { Role } from ".prisma/client";
import { Command } from "../typings";
import { getGuildId, validateVoiceCommand } from "../utils/discord";

/**
 * Command that shows the name and url of the currently playing song
 */
const Now: Command = {
  name: "now",
  description: "Show current song.",
  args: false,
  cooldown: 5,
  usage: "",
  aliases: [],
  guildOnly: true,
  permission: Role.MEMBER,
  execute: async (message, args): Promise<void> => {
    validateVoiceCommand(Now, args, message);
    message.client.emit("currentSong", getGuildId(message), message);
  },
};

export default Now;
