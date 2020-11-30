import axios from 'axios'
import { Command } from '../typings'

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
      message.channel.send(result.data).catch((err) => console.log(err))
    }).catch((err) => {
      console.log(err)
      message.channel.send('Shit just hits the fan...').catch((err) => console.log(err))
    })
  }
}

export default Inspire
