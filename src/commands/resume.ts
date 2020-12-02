import { Command } from '../typings'
import * as music from '../utils/music'

const Resume: Command = {
  name: 'resume',
  description: 'Continue playing all songs in the queue!',
  args: false,
  cooldown: 10,
  usage: '',
  aliases: [],
  guildOnly: true,
  execute (message, args) {
    const voiceChannelUser = message.member?.voice.channel
    if (music.validateVoiceChannel(message)) {
      message.client.emit('resumeSong', voiceChannelUser?.guild.id, message)
    }
  }
}

export default Resume
