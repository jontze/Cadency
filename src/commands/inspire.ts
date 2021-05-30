import axios from "axios";
import { Command } from "../typings";
import { Role } from ".prisma/client";

/**
 * Command that send something inspiring to the user
 */
const Inspire: Command = {
  name: "inspire",
  description: "Say something really inspiring!",
  args: false,
  cooldown: 10,
  usage: "",
  aliases: [],
  guildOnly: false,
  permission: Role.MEMBER,
  execute: async (message, args): Promise<void> => {
    await message.channel.send(
      (
        await axios.get("https://inspirobot.me/api?generate=true")
      ).data
    );
  },
};

export default Inspire;
