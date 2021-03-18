import querystring from "query-string";
import axios from "axios";
import { MessageEmbed } from "discord.js";
import { Command, UrbanDictionary } from "../typings";
import logger from "../logger";

const trim = (str: string, max: number): string =>
  str.length > max ? `${str.slice(0, max - 3)}...` : str;

const Urban: Command = {
  name: "urban",
  description: "Searches the Urbandictionary for the user input",
  guildOnly: true,
  aliases: ["ud", "dictionary"],
  cooldown: 10,
  args: true,
  usage: "<word>",
  execute(message, args) {
    // Create Querystring
    const query = querystring.stringify({ term: args.join(" ") });
    // Send request
    axios
      .get(`https://api.urbandictionary.com/v0/define?${query}`)
      .then((result) => {
        const firstMatch: UrbanDictionary | undefined = result.data.list[0];
        // Check if list has entrys
        if (firstMatch === undefined) {
          message.channel
            .send(`Kein Eintrag für **${args.join(" ")}**.`)
            .catch((err) => logger.error(err));
        } else {
          // Create, style and send message
          const embed = new MessageEmbed();
          embed
            .setColor("#EFFF00")
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
          message.channel.send(embed).catch((err) => logger.error(err));
        }
      })
      .catch((err) => {
        logger.error(err);
        message.channel
          .send("Shit just hits the fan...")
          .catch((err) => logger.error(err));
      });
  },
};

export default Urban;
