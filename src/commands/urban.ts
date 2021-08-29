import querystring from "query-string";
import axios from "axios";
import { MessageEmbed } from "discord.js";
import { Command, UrbanDictionary } from "../typings";
import { Role } from ".prisma/client";
import { DEFAULT_COLOR } from "../cadency/constants/Cadency.constants";

const trim = (str: string, max: number): string =>
  str.length > max ? `${str.slice(0, max - 3)}...` : str;

/**
 * Command that searchs for a word or a phrase in the urban dictionary
 * and returns the first match
 */
const Urban: Command = {
  name: "urban",
  description: "Searches the Urbandictionary for the user input",
  guildOnly: true,
  aliases: ["ud", "dictionary"],
  cooldown: 10,
  args: true,
  usage: "<word>",
  permission: Role.MEMBER,
  execute: async (message, args): Promise<void> => {
    // Create Querystring
    if (args[0] == null) throw new Error("Args undefined");
    const query = querystring.stringify({ term: args.join(" ") });
    // Send request
    const urbanResult = await axios.get(
      `https://api.urbandictionary.com/v0/define?${query}`
    );
    const firstMatch: UrbanDictionary | undefined = urbanResult.data.list[0];
    // Check if list has entrys
    if (firstMatch == null) {
      await message.channel.send(`Kein Eintrag für **${args.join(" ")}**.`);
    } else {
      // Create, style and send message
      const embed = new MessageEmbed();
      embed
        .setColor(DEFAULT_COLOR)
        .setTitle(trim(firstMatch.word, 256))
        .setURL(firstMatch.permalink)
        .addFields(
          { name: "Definition", value: trim(firstMatch.definition, 1024) },
          { name: "Example", value: trim(firstMatch.example, 1024) },
          {
            name: "Rating",
            value: `${firstMatch.thumbs_up} :thumbsup: \n ${firstMatch.thumbs_down} :thumbsdown:`,
          }
        );
      await message.channel.send({ embeds: [embed] });
    }
  },
};

export default Urban;
