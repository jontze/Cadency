import { Role } from ".prisma/client";
import { Command } from "../typings";
import { getGuildId, validateVoiceCommand } from "../utils/discord";

/**
 * Command that pauses the currently playing song
 */
const Pause: Command = {
  name: "pause",
  description: "Pause all songs in the queue!",
  args: false,
  cooldown: 10,
  usage: "",
  aliases: [""],
  guildOnly: true,
  permission: Role.MEMBER,
  execute: async (message, args): Promise<void> => {
    validateVoiceCommand(Pause, args, message);
    message.client.emit("pauseSong", getGuildId(message), message);
  },
};

export default Pause;
