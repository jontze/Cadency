import { Command } from '../typings'
import cmd from '../commands'
import { MessageEmbed } from 'discord.js'

const Help: Command = {
  name: 'help',
  description: 'List all of my commands.',
  args: false,
  cooldown: 5,
  usage: '',
  aliases: ['commands'],
  guildOnly: false,
  execute (message, args) {
    const embed = new MessageEmbed()
      .setColor('#008000')
      .setTitle('A list of all commands')
    let position = 1
    for (const key in cmd) {
      if (Object.prototype.hasOwnProperty.call(cmd, key)) {
        const element = cmd[key]
        embed.addField(`${position}. ${element.description}`, `${element.name} ${element.usage}\n cooldown: ${element.cooldown} ${element.aliases.length === 0 ? '' : `\n aliases: ${element.aliases.join(', ')}`}`)
        position = position + 1
      }
    }
    message.channel.send(embed).catch((err) => console.log(err))
  }
}

export default Help
