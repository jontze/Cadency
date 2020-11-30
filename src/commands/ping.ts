import { Command } from '../typings'

const Ping: Command = {
  name: 'ping',
  description: 'Ping-Pong!',
  cooldown: 5,
  usage: '',
  args: false,
  aliases: [],
  guildOnly: false,
  execute: (message, args): void => {
    message.channel.send('Pong').catch((err) => {
      console.log(err)
    })
  }
}

export default Ping
