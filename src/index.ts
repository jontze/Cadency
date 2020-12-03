import DiscordBot from './bot'
import dotenv from 'dotenv'
import { BotConfig } from './typings'
dotenv.config()

const config: BotConfig = {
  prefix: (process.env.BOT_PREFIX as BotConfig['prefix']),
  activity: (process.env.BOT_ACTIVITY as BotConfig['activity']),
  activityType: (process.env.BOT_ACTIVITY_TYPE as BotConfig['activityType']),
  status: (process.env.BOT_ONLINE_STATUS as BotConfig['status'])
}

new DiscordBot((process.env.BOT_TOKEN as string), config).start()
