import { Command } from '../typings'
import logger from '../logger'

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
      logger.error(err)
    })
  }
}

export default Ping
