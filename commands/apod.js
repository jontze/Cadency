const fetch = require('node-fetch');
const Discord = require('discord.js');

module.exports = {
  name: "apod",
  dscription: "Shows the Astronomy Picture of the Day featured by the NASA-API",
  cooldown: 10,
  usage: "",
  execute(message, args) {
    fetch("https://api.nasa.gov/planetary/apod?api_key="+process.env.NASA_TOKEN)
    .then(result => result.json())
    .then(json => {
      if (!json) {
        return message.channel.send("API-Error!");
      }
      const embed = new Discord.MessageEmbed()
      .setColor('#EFFF00')
      .setTitle(json.title)
      .addFields(
        { name: 'Media', value: json.url },
        { name: 'Explanation', value: json.explanation },
      )
      .setImage(json.url);
      return message.channel.send(embed);
    })
    .catch(err => {
      console.log(err);
      return message.channel.send("Internal error :(((");
    })

  },
};
