import { Command } from "../typings";
import { Role } from ".prisma/client";
import messageContent from "../message-content";

/**
 * Command that send a list of all available commands per DM to
 * the for help asking user
 */
const Help: Command = {
  name: "help",
  description: "List all of my commands.",
  args: false,
  cooldown: 5,
  usage: "",
  aliases: ["commands"],
  guildOnly: false,
  permission: Role.MEMBER,
  execute: async (message, args): Promise<void> => {
    await message.channel.send(
      messageContent.command.helpDM(message.author.toString())
    );
    await message.author.send({ embeds: [messageContent.command.help()] });
  },
};

export default Help;
