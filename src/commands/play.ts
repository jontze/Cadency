import ytdl from 'ytdl-core'
import { Message } from 'discord.js'

import { Command } from '../typings'

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

function parseUserInput (args: string[]): string {
  if (args.length === 1 && ytdl.validateURL(args[0])) {
    return args[0]
  } else {
    return ''
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
      const videoUrl = parseUserInput(args)
      if (videoUrl === '') {
        message.channel.send('Invalid Youtube-Link!').catch(err => console.log(err))
      } else {
        voiceChannelUser?.join().then((connection) => {
          connection.play(ytdl(videoUrl))
          message.channel.send(`:white_check_mark: **Joined** ${voiceChannelUser.name} by order of ${message.author.username} \n**Playing** :notes: \`${videoUrl}\``).catch(err => console.log(err))
        }).catch(err => console.log(err))
      }
    }
  }
}

export default Play
