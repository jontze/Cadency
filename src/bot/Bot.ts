import { Client } from 'discord.js'

import { BotInterface as BotI, BotConfig } from '../types'

export default class DiscordBot implements BotI {
  private readonly token: string = ''
  private readonly prefix: string
  private client: Client | undefined = undefined
  private readonly config: BotConfig

  constructor (token: string, prefix: string = '/', config: BotConfig = { activity: 'with fire', activityType: 'PLAYING' }) {
    this.token = token
    this.prefix = prefix
    this.config = config
  }

  public start (): void {
    this.client = new Client()
    this.client.login(this.token).then(() => {
      console.log('Start awesome things...')
    }).catch((err) => console.log(err))
    this.client.user?.setActivity(this.config.activity, {
      type: this.config.activityType
    }).catch((err) => console.log(err))
  }
}
