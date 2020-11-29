import { Command } from '../typings'

const Test: Command = {
  name: 'test',
  description: 'Test the Bot!',
  args: true,
  usage: '<randomString>',
  guildOnly: false,
  cooldown: 5,
  aliases: [],
  execute (message, args) {
    if (args[0] !== undefined) {
      message.channel.send('Testing...works!').catch((err) => console.log(err))
    }
  }
}

export default Test
