import { Role } from ".prisma/client";
import { Command } from "../typings";
import { getGuildId } from "../utils/discord";

/**
 * Command that is only available to server admins to change the used prefix of the
 * bot
 */
const Prefix: Command = {
  name: "prefix",
  description: "Change the command prefix",
  guildOnly: true,
  aliases: [],
  cooldown: 5,
  args: true,
  usage: "<newPrefix>",
  permission: Role.ADMIN,
  execute: async (message, args): Promise<void> => {
    message.client.emit("updatePrefix", message, getGuildId(message), args);
  },
};

export default Prefix;
