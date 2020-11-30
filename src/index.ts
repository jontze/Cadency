import DiscordBot from './bot'
import dotenv from 'dotenv'
dotenv.config()

new DiscordBot((process.env.BOT_TOKEN as string)).start()
