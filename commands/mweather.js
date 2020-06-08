const fetch = require('node-fetch');
const Discord = require('discord.js');

module.exports = {
  name: "mars-weather",
  description: "Shows the Astronomy Picture of the Day featured by the NASA-API",
  cooldown: 10,
  usage: "",
  aliases: ["mweather", "mw", "mars"],
  execute(message, args) {
    fetch("https://api.nasa.gov/insight_weather/?feedtype=json&ver=1.0&api_key="+process.env.NASA_TOKEN)
    .then(result => result.json())
    .then(json => {
      if (!json) {
        return message.channel.send("API-Error!");
      }
      console.log(json);
      const last_sol = Math.max.apply(null, json["sol_keys"]).toString();
      console.log(last_sol);
      const embed = new Discord.MessageEmbed()
      .setColor('#EFFF00')
      .setTitle(`Mars Weather on Sol ${last_sol}`)
      .addFields(
        { name: 'Average Temperature', value: json[last_sol].AT.av },
        { name: 'Min. Temperature', value: json[last_sol].AT.mn },
        { name: 'Max. Temperature', value: json[last_sol].AT.mx },
        { name: 'Average Atmospheric Pressure', value: json[last_sol].PRE.av },
        { name: 'Min. Atmospheric Pressure', value: json[last_sol].PRE.mn },
        { name: 'Max. Atmospheric Pressure', value: json[last_sol].PRE.mx },
        { name: 'Average Horizontal Wind Speed', value: json[last_sol].HWS.av },
      )
      return message.channel.send(embed);
    })
    .catch(err => {
      console.log(err);
      return message.channel.send("Internal error :(((");
    })

  },
};
