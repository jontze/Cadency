import ytdl, { MoreVideoDetails } from 'ytdl-core'
import { Message } from 'discord.js'

import { Command, QueueSong } from '../typings'

function validateVoiceChannel (message: Message): boolean {
  if (message.member?.voice.channel == null) {
    message.channel.send('You need to be in a voice channel to play music!').catch((err) => console.log(err))
    return false
  } else {
    const permission = message.member?.voice.channel.permissionsFor(message.client.user != null ? message.client.user : '')
    if (permission == null || !permission.has('CONNECT') || !permission.has('SPEAK')) {
      message.channel.send('I need the permissions to join and speak in your voice channel!').catch((err) => console.log(err))
      return false
    } else {
      return true
    }
  }
}

async function requestSongInfo (message: Message, args: string[]): Promise<MoreVideoDetails | undefined> {
  if (args.length === 1 && ytdl.validateURL(args[0])) {
    try {
      const videoInfo = await ytdl.getInfo(args[0])
      return videoInfo.videoDetails
    } catch (e) {
      console.log(e)
    }
  } else {
    return undefined
  }
}

const Play: Command = {
  name: 'play',
  description: 'Play a song from youtube by URL.',
  args: true,
  cooldown: 10,
  usage: '<youtube-video-url>',
  aliases: [''],
  guildOnly: true,
  execute (message, args) {
    const voiceChannelUser = message.member?.voice.channel

    if (validateVoiceChannel(message)) {
      requestSongInfo(message, args).then((videoInfo) => {
        if (videoInfo === undefined) {
          message.channel.send('Invalid Youtube-Link!').catch(err => console.log(err))
        } else {
          const serverQueue: QueueSong = {
            textChannel: message.channel,
            voiceChannel: voiceChannelUser,
            connection: null,
            songs: [],
            volume: 5,
            playing: false
          }
          serverQueue.songs.push(videoInfo)
          message.client.emit('addSong', serverQueue, voiceChannelUser?.guild.id, message)
        }
      }).catch(err => console.log(err))
    }
  }
}

export default Play
