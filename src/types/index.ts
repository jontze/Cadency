import { Message } from 'discord.js'

export interface BotInterface {
  start: () => void
}

export interface BotConfig {
  activity: string
  activityType: 'PLAYING' | 'STREAMING' | 'LISTENING' | 'WATCHING' | 'CUSTOM_STATUS' | 'COMPETING'
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
