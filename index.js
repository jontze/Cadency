require('dotenv').config()
const fs = require('fs');
const Discord = require('discord.js');

const client = new Discord.Client();
client.commands = new Discord.Collection();

// Dynamic Command-File loader
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
for (const file in commandFiles) {
  const command = require(`./commands/${commandFiles[file]}`);
  client.commands.set(command.name, command);
}

const cooldowns = new Discord.Collection();

client.once("ready", ()=> {
  console.log("Ready!");
  client.user.setActivity(process.env.ACTIVITY, { type: 'WATCHING' });
});

client.on("message", (message) => {
  if (!message.content.startsWith(process.env.PREFIX) || message.author.bot) return;

  const args = message.content.slice(process.env.PREFIX.length).split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName)
   || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
  if (!command) return;

  // Check if Command is only working on servers not on DMs
  if (command.guildOnly && message.channel.type !== "text") {
    return message.reply('I can\'t execute that command inside DMs!');
  }

  // Check if Command requires Args
  if (command.args && !args.length) {
    let reply = `You didn't provide any arguments, ${message.author}!`;
    if (command.usage) {
      reply += `\nThe proper usage would be: \`${process.env.PREFIX}${command.name} ${command.usage}\``
    }
    return message.channel.send(reply);
  }

  // Manage Cooldowns
  if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}
  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || 3) * 1000;
  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
    }
  }
  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

  // Try to execute the Command
  try {
    command.execute(message, args);
  } catch (e) {
    console.error(e);
    message.reply("There was an error trying to execute that command!");
  }
});

client.login(process.env.BOT_TOKEN);
