import { Message } from 'discord.js'
import ytdl, { MoreVideoDetails } from 'ytdl-core'
import logger from '../logger'

export function validateVoiceChannel (message: Message): boolean {
  if (message.member?.voice.channel == null) {
    message.channel.send('You need to be in a voice channel to play music!').catch((err) => logger.error(err))
    return false
  } else {
    const permission = message.member?.voice.channel.permissionsFor(message.client.user != null ? message.client.user : '')
    if (permission == null || !permission.has('CONNECT') || !permission.has('SPEAK')) {
      message.channel.send('I need the permissions to join and speak in your voice channel!').catch((err) => logger.error(err))
      return false
    } else {
      return true
    }
  }
}

export async function requestSongInfo (message: Message, args: string[]): Promise<MoreVideoDetails | undefined> {
  if (args.length === 1 && ytdl.validateURL(args[0])) {
    try {
      const videoInfo = await ytdl.getInfo(args[0])
      return videoInfo.videoDetails
    } catch (err) {
      logger.error(err)
    }
  } else {
    return undefined
  }
}
