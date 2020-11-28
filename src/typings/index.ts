import { Message, ActivityType } from 'discord.js'

export interface BotInterface {
  start: () => void
}

export interface BotConfig {
  activity: string
  activityType: ActivityType
}

export interface Command {
  readonly name: string
  readonly description: string
  readonly cooldown: number
  readonly usage: string
  readonly args: boolean
  readonly guildOnly: boolean
  readonly aliases: string[]
  execute: (message: Message, args: any[]) => void
}

export interface CommandsInterface {
  ping: Command
  test: Command
}
