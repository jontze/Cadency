import { Client, Message } from 'discord.js'

import { BotInterface as BotI, BotConfig, CommandsInterface, PossibleCommands } from '../typings'
import commands from '../commands'

export default class DiscordBot implements BotI {
  private readonly token: string = ''
  private readonly prefix: string
  private readonly client: Client
  private readonly config: BotConfig
  private readonly commands: CommandsInterface

  constructor (token: string, prefix: string = '/', config: BotConfig = { activity: 'with fire', activityType: 'PLAYING' }) {
    this.token = token
    this.prefix = prefix
    this.config = config
    this.commands = commands
    this.client = new Client()
  }

  public start (): void {
    this.client.login(this.token).then(() => {
      console.log('Start awesome things...')
    }).catch((err) => console.log(err))

    this.client.on('ready', () => {
      this.client.user?.setActivity(this.config.activity, {
        type: this.config.activityType
      }).catch((err) => console.log(err))
    })

    this.client.on('message', this.messageHandler.bind(this))
  }

  private messageHandler (message: Message): string | null {
    // Ignore messages without prefix or sended by bots
    if (!message.content.startsWith(this.prefix) || message.author.bot) return null

    // Parse Args and Command-Name
    const args = message.content.slice(this.prefix.length).split(/ +/).slice(1)
    const commandName: PossibleCommands = (message.content.slice(this.prefix.length).split(/ +/)[0].toLowerCase() as PossibleCommands)
    console.log(args)
    console.log(commandName)
    // Get Command
    const command = this.commands[commandName]
    console.log(command)

    return 'string'
  }
}
