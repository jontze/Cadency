import { Collection, Message, Client, MessageEmbed } from 'discord.js'
import ytdl from 'ytdl-core'

import { BotInterface as BotI, BotConfig, Commands, Command, QueueSong } from '../typings'
import commands from '../commands'
import logger from '../logger'

export default class DiscordBot implements BotI {
  private readonly token: string
  private readonly client: Client
  private readonly config: BotConfig
  private readonly commands: Commands
  private readonly cooldowns: Collection<string, Collection<string, number>>
  private readonly songList: Collection<string, QueueSong>

  constructor (token: string, config: BotConfig = { prefix: '/', activity: 'Listen to some music', activityType: 'CUSTOM_STATUS', status: 'idle' }) {
    this.token = token
    this.config = config
    this.commands = commands
    this.client = new Client()
    this.cooldowns = new Collection()
    this.songList = new Collection()
  }

  public start (): void {
    this.client.login(this.token).then(() => {
      logger.info('Start awesome things...')
    }).catch((err) => logger.error(err))

    // Listen until startup finished
    this.client.on('ready', () => {
      this.client.user?.setPresence({
        activity: {
          name: this.config.activity,
          type: this.config.activityType
        },
        status: this.config.status
      }).catch((err) => logger.error(err))
    })

    // Listen to incoming messages
    this.client.on('message', this.messageHandler.bind(this))

    // Listen to incoming songs
    this.client.on('addSong', this.songHandler.bind(this))

    // Listen to pause-event
    this.client.on('pauseSong', this.pauseSongHandler.bind(this))

    // Listen to resume-song-event
    this.client.on('resumeSong', this.resumeSongHandler.bind(this))

    // Listen to skip-song-event
    this.client.on('skipSong', this.skipSongHandler.bind(this))

    // Listen to show-playlist-event
    this.client.on('showPlaylist', this.showPlaylistHandler.bind(this))

    // Listen to purge-playlist-event
    this.client.on('purgePlaylist', this.purgePlaylistHandler.bind(this))
  }

  private messageHandler (message: Message): void {
    // Ignore messages without prefix or sended by bots
    if (!message.content.startsWith(this.config.prefix) || message.author.bot) return

    // Parse Args and Command-Name
    const [args, commandName] = this.parseArgsAndCommand(message)

    // Get Command
    const command = this.getCommand(commandName)
    if (command === undefined) return

    // Check if Command is only working on servers and not on DMs
    this.checkGuildOnly(command, message)

    // Check if Command requires Args
    this.checkArgsRequired(command, args, message)

    // Check Command Cooldown of Author
    if (this.hasCooldown(command, message)) return

    // Try to execute the command
    try {
      command.execute(message, args)
    } catch (e) {
      message.reply('There was an error trying to execute that command!').catch((err) => logger.error(err))
    }
  }

  private parseArgsAndCommand (message: Message): [string[], string] {
    const args = message.content.slice(this.config.prefix.length).split(/ +/).slice(1)
    const commandName = message.content.slice(this.config.prefix.length).split(/ +/)[0].toLowerCase()
    logger.info(`Command: ${commandName}, args: ${args.join(' ')}`)
    return [args, commandName]
  }

  private getCommand (name: string): Command | undefined {
    const command: Command | undefined = this.commands[name] ?? this.searchAliases(name)
    return command
  }

  private searchAliases (name: string): Command | undefined {
    const command = undefined
    for (const key in this.commands) {
      if (this.commands[key].aliases.includes(name)) {
        return this.commands[key]
      }
    }
    return command
  }

  private checkGuildOnly (command: Command, message: Message): void {
    if (command.guildOnly && message.channel.type !== 'text') {
      message.reply('I can\'t execute that command inside DMs!').catch((err) => logger.error(err))
    }
  }

  private checkArgsRequired (command: Command, args: string[], message: Message): void {
    if (command.args && args.length === 0) {
      let reply = `You didn't provide any arguments, @${message.author.toString()}!`
      reply += `\nThe proper usage would be: \`${this.config.prefix}${command.name} ${command.usage}\``
      message.channel.send(reply).catch((err) => logger.error(err))
    }
  }

  private hasCooldown (command: Command, message: Message): boolean {
    // Add Command to Collection if never used
    if (!this.cooldowns.has(command.name)) {
      this.cooldowns.set(command.name, new Collection())
    }
    const now = Date.now()
    const cooldownAmount = command.cooldown * 1000
    // Check if Author already in collection
    if (this.cooldowns.get(command.name)?.has(message.author.id) === true) {
      // Check if cooldown passed
      const expirationTime = (this.cooldowns.get(command.name)?.get(message.author.id) as number) + cooldownAmount
      if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000
        message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`).catch((err) => logger.error(err))
        return true
      }
    }
    // Set Timestamp in cooldown collection
    this.cooldowns.get(command.name)?.set(message.author.id, now)
    // Delete entry after cooldown
    setTimeout(() => this.cooldowns.get(command.name)?.delete(message.author.id), cooldownAmount)
    return false
  }

  private songHandler (song: QueueSong, guildId: string, message: Message): void {
    this.addSong(song, guildId, message)
    if (this.songList.get(guildId)?.playing === false) {
      this.playGuildPlaylist(guildId)
    }
  }

  private addSong (song: QueueSong, guildId: string, message: Message): void {
    if (this.songList.get(guildId) === undefined) {
      this.songList.set(guildId, song)
      message.channel.send(`:white_check_mark: **Joined** ${song.voiceChannel === null || song.voiceChannel === undefined ? 'Unknown-Channel' : song.voiceChannel.name} \n**Playing** :notes: \`${song.songs[0].video_url}\` \n:newspaper: \`${song.songs[0].title}\``).catch((err) => logger.error(err))
    } else {
      const serverSongs = this.songList.get(guildId)
      serverSongs?.songs.push(song.songs[0])
      message.channel.send(`:white_check_mark: Added song to the queue \n**Playing** :notes: \`${song.songs[0].video_url}\` \n:newspaper: \`${song.songs[0].title}\``).catch((err) => logger.error(err))
    }
  }

  private playGuildPlaylist (guildId: string): void {
    const guildData = this.songList.get(guildId)
    if (guildData === undefined) return
    guildData?.voiceChannel?.join().then((connection) => {
      guildData.connection = connection
      guildData.playing = true
      connection.play(ytdl(guildData.songs[0].video_url))
        .on('finish', () => {
          guildData.songs.shift()
          if (guildData.songs.length === 0) {
            this.songList.delete(guildId)
            guildData.voiceChannel?.leave()
          }
          this.playGuildPlaylist(guildId)
        })
        .on('error', (err) => logger.error(err))
    }).catch((err) => logger.error(err))
  }

  private pauseSongHandler (guildId: string, message: Message): void {
    const guildData = this.songList.get(guildId)
    if (guildData?.connection != null && guildData?.playing) {
      guildData.connection.dispatcher.pause()
      guildData.playing = false
    } else {
      message.channel.send('I can\'t pause...no music is playing.').catch((err) => logger.error(err))
    }
  }

  private resumeSongHandler (guildId: string, message: Message): void {
    const guildData = this.songList.get(guildId)
    if (guildData?.connection != null && !guildData?.playing) {
      guildData.connection.dispatcher.resume()
      guildData.playing = true
    } else if (guildData?.connection != null && guildData?.playing) {
      message.channel.send('The music is already playing...').catch((err) => logger.error(err))
    } else {
      message.channel.send('I can\'t resume...no music is in the queue.').catch((err) => logger.error(err))
    }
  }

  private skipSongHandler (guildId: string, message: Message): void {
    const guildData = this.songList.get(guildId)
    if (guildData?.connection != null && guildData.songs.length > 0) {
      guildData.connection.dispatcher.end()
    } else {
      message.channel.send('I can\'t skip...no music is in the queue.').catch((err) => logger.error(err))
    }
  }

  private showPlaylistHandler (guildId: string, message: Message): void {
    const guildData = this.songList.get(guildId)
    if (guildData?.connection != null && guildData.songs.length > 0) {
      // send EmbedMessage with Songs
      const embed = new MessageEmbed()
      embed
        .setColor('#008000')
        .setTitle('Playlist')
      for (let i = 0; i < guildData.songs.length; i++) {
        const songElement = guildData.songs[i]
        const position = i + 1
        embed.addField(`${position}. :newspaper: \`${songElement.title}\``, `:notes: \`${songElement.video_url}\``)
      }
      message.channel.send(embed).catch((err) => logger.error(err))
    } else {
      message.channel.send(':no_entry_sign: **No songs in the queue**').catch((err) => logger.error(err))
    }
  }

  private purgePlaylistHandler (guildId: string, message: Message): void {
    const guildData = this.songList.get(guildId)
    if (guildData?.connection != null && guildData.songs.length > 0) {
      // purge playlist and end dispatcher
      guildData.songs.length = 0
      guildData.connection.dispatcher.end()
      message.channel.send(':white_check_mark: :wastebasket: **Successfully cleared the playlist**').catch((err) => logger.error(err))
    } else {
      message.channel.send(':no_entry_sign: **The playlist is already empty**').catch((err) => logger.error(err))
    }
  }
}
