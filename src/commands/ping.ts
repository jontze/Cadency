import { Command } from "../typings";
import { Role } from ".prisma/client";
import messageContent from "../message-content";

/**
 * Ping-pong command. Mainly used for testing the availability
 * and delay of the bot.
 */
const Ping: Command = {
  name: "ping",
  description: "Ping-Pong!",
  cooldown: 5,
  usage: "",
  args: false,
  aliases: [],
  guildOnly: false,
  permission: Role.MEMBER,
  execute: async (message, args): Promise<void> => {
    await message.channel.send(messageContent.command.pong);
  },
};

export default Ping;
