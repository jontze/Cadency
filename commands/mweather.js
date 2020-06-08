const fetch = require('node-fetch');
const Discord = require('discord.js');

module.exports = {
  name: "mars-weather",
  description: "Shows the weather measurements on the surface of Mars at Elysium Planitia, a flat, smooth plain near Mars’ equator on the last Sol.",
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
      const last_sol = Math.max.apply(null, json["sol_keys"]).toString();
      const embed = new Discord.MessageEmbed()
      .setColor('#D80000')
      .setTitle(`Mars Weather on Sol ${last_sol}`)
      .addFields(
        { name: 'Average Temperature (°C)', value: json[last_sol].AT.av.toFixed(2), inline: true},
        { name: 'Min. Temperature (°C)', value: json[last_sol].AT.mn.toFixed(2), inline: true},
        { name: 'Max. Temperature (°C)', value: json[last_sol].AT.mx.toFixed(2), inline: true},
      )
      .addFields(
        { name: 'Average Atmospheric Pressure (Pa)', value: json[last_sol].PRE.av.toFixed(2), inline: true},
        { name: 'Min. Atmospheric Pressure (Pa)', value: json[last_sol].PRE.mn.toFixed(2), inline: true},
        { name: 'Max. Atmospheric Pressure (Pa)', value: json[last_sol].PRE.mx.toFixed(2), inline: true},
      )
      .addFields(
        { name: 'Average Horizontal Wind Speed (m/s)', value: json[last_sol].HWS.av.toFixed(2), inline: true},
      )
      return message.channel.send(embed);
    })
    .catch(err => {
      console.log(err);
      return message.channel.send("Internal error :(((. Shit just hits the fan...");
    })

  },
};
