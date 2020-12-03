import axios from 'axios'
import { Command } from '../typings'
import logger from '../logger'

const Inspire: Command = {
  name: 'inspire',
  description: 'Say something really inspiring!',
  args: false,
  cooldown: 10,
  usage: '',
  aliases: [],
  guildOnly: false,
  execute (message, args) {
    axios.get('https://inspirobot.me/api?generate=true').then((result) => {
      message.channel.send(result.data).catch((err) => logger.error(err))
    }).catch((err) => {
      logger.error(err)
      message.channel.send('Shit just hits the fan...').catch((err) => logger.error(err))
    })
  }
}

export default Inspire
