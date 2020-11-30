import { Client, Collection, Message } from 'discord.js'

import { BotInterface as BotI, BotConfig, Commands, Command } from '../typings'
import commands from '../commands'

export default class DiscordBot implements BotI {
  private readonly token: string
  private readonly prefix: string
  private readonly client: Client
  private readonly config: BotConfig
  private readonly commands: Commands
  private readonly cooldowns: Collection<string, Collection<string, number>>

  constructor (token: string, prefix: string = '/', config: BotConfig = { activity: 'with fire', activityType: 'PLAYING' }) {
    this.token = token
    this.prefix = prefix
    this.config = config
    this.commands = commands
    this.client = new Client()
    this.cooldowns = new Collection()
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

  private messageHandler (message: Message): void {
    // Ignore messages without prefix or sended by bots
    if (!message.content.startsWith(this.prefix) || message.author.bot) return

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
      message.reply('There was an error trying to execute that command!').catch((err) => console.log(err))
    }
  }

  private parseArgsAndCommand (message: Message): [string[], string] {
    const args = message.content.slice(this.prefix.length).split(/ +/).slice(1)
    const commandName = message.content.slice(this.prefix.length).split(/ +/)[0].toLowerCase()
    console.log(args)
    console.log(commandName)
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
      message.reply('I can\'t execute that command inside DMs!').catch((err) => console.log(err))
    }
  }

  private checkArgsRequired (command: Command, args: string[], message: Message): void {
    if (command.args && args.length === 0) {
      let reply = `You didn't provide any arguments, @${message.author.toString()}!`
      reply += `\nThe proper usage would be: \`${this.prefix}${command.name} ${command.usage}\``
      message.channel.send(reply).catch((err) => console.log(err))
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
        message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`).catch((err) => console.log(err))
        return true
      }
    }
    // Set Timestamp in cooldown collection
    this.cooldowns.get(command.name)?.set(message.author.id, now)
    // Delete entry after cooldown
    setTimeout(() => this.cooldowns.get(command.name)?.delete(message.author.id), cooldownAmount)
    return false
  }
}
