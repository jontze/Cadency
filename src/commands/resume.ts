import { Role } from ".prisma/client";
import { Command } from "../typings";
import { getGuildId, validateVoiceCommand } from "../utils/discord";

/**
 * Command to continue a beforehand stopped song
 */
const Resume: Command = {
  name: "resume",
  description: "Continue playing all songs in the queue!",
  args: false,
  cooldown: 10,
  usage: "",
  aliases: [],
  guildOnly: true,
  permission: Role.MEMBER,
  execute: async (message, args): Promise<void> => {
    validateVoiceCommand(Resume, args, message);
    message.client.emit("resumeSong", getGuildId(message), message);
  },
};

export default Resume;
