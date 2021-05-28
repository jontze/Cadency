import { Command } from "../typings";
import { Role } from ".prisma/client";
import messageContent from "../message-content";

/**
 * Command to slap a another player on the server with a large
 * trout.
 */
const Slap: Command = {
  name: "slap",
  description: "Slap someone with a large trout!",
  args: true,
  guildOnly: true,
  usage: "<@Playername>",
  cooldown: 5,
  aliases: [],
  permission: Role.MEMBER,
  execute: async (message, args): Promise<void> => {
    const author = message.author.toString();
    const botId = message.client.user?.toString();
    const slapTarget = args[0];
    if (slapTarget == null) throw new Error("Args undefined");
    if (author.toString() === slapTarget.replace("!", "")) {
      await message.channel.send(
        messageContent.command.slapYourself(author.toString())
      );
      return;
    }

    if (slapTarget.replace("!", "") === botId && botId != null) {
      await message.channel.send(
        messageContent.command.slapBot(botId, author.toString())
      );
      return;
    }
    await message.channel.send(
      messageContent.command.slap(author.toString(), slapTarget)
    );
  },
};

export default Slap;
