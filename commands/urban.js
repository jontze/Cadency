const fetch = require('node-fetch');
const querystring = require('querystring');
const Discord = require('discord.js');

const trim = (str, max) => (str.length > max ? `${str.slice(0, max - 3)}...` : str);

module.exports = {
  name: "urban",
  description: "Searches the Urbandictionary for the user input",
  aliases: ["ud", "dictionary"],
  cooldown: 5,
  args: true,
  usage: "<word>",
  execute(message, args) {
    const query = querystring.stringify({term: args.join(" ")});
    fetch(`https://api.urbandictionary.com/v0/define?${query}`)
      .then((result) => result.json())
      .then(json => {
        if (!json.list[0]) {
          return message.channel.send(`Kein Eintrag für **${args.join(' ')}**.`);
        }
        const embed = new Discord.MessageEmbed()
        .setColor('#EFFF00')
			  .setTitle(json.list[0].word)
			  .setURL(json.list[0].permalink)
        .addFields(
  				{ name: 'Definition', value: trim(json.list[0].definition, 1024) },
  				{ name: 'Example', value: trim(json.list[0].example, 1024) },
  				{ name: 'Rating', value: `${json.list[0].thumbs_up} thumbs up. ${json.list[0].thumbs_down} thumbs down.` },
			  );
        return message.channel.send(embed);
        //message.channel.send(json);
      })
      .catch(err => {
        console.log(err);
        return message.channel.send("Internal Error :(((");
      })
  },
};
