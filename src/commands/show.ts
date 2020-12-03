import { Command } from '../typings'
import * as music from '../utils/music'

const Show: Command = {
  name: 'show',
  description: 'Show all songs in the queue!',
  args: false,
  cooldown: 5,
  usage: '',
  aliases: [],
  guildOnly: true,
  execute (message, args) {
    const voiceChannelUser = message.member?.voice.channel
    if (music.validateVoiceChannel(message)) {
      message.client.emit('showPlaylist', voiceChannelUser?.guild.id, message)
    }
  }
}

export default Show
