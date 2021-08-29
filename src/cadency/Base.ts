import { Client, Intents, Message } from "discord.js";
import { messageHandler } from "../events/messageHandler";
import messageContent from "../message-content";
import Config from "./Config";
import Database from "../database/Database";
import logger from "../logger";
import { getPrefix } from "../utils/database";

/**
 * Base Bot class to setup the fundamentals, log-in,
 * apply configugrations and react to basic events.
 * @param {Config} config Configuration class
 */
export default class Base {
  protected readonly client = new Client({
    intents: [
      Intents.FLAGS.GUILDS,
      Intents.FLAGS.GUILD_MESSAGES,
      Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
      Intents.FLAGS.GUILD_MEMBERS,
      Intents.FLAGS.GUILD_VOICE_STATES,
    ],
  });
  protected readonly db = new Database();

  constructor(private readonly config: Config) {
    this.constructBuiltInEventHandler();
  }

  /**
   * Login and start the cadency bot with the unique bot token
   */
  public start(): void {
    this.client
      .login(this.config.token)
      .then(() => {
        logger.info(messageContent.bot.start);
      })
      .catch((err) => {
        logger.error("Error on login", err);
      });
  }

  /**
   * Wrapps the message handler to pass the server specific pefix to the
   * message handler
   * @param  {Message} message Message object
   */
  private async messageHandlerWrapper(message: Message): Promise<void> {
    if (message.author.bot) return;
    logger.debug(message);
    try {
      await messageHandler(
        message,
        await getPrefix(message.guild?.id ?? "", this.db)
      );
    } catch (err) {
      await message.channel.send(messageContent.error.fatal);
      logger.error("Error in messageHandlerWrapper", err);
    }
  }

  /**
   * Set up event handler to built-in discordjs events
   */
  private constructBuiltInEventHandler(): void {
    // Listen until startup finished
    this.client.on("ready", () => {
      if (this.client.user == null) {
        logger.warn("User undefined. Could not set presence.");
        return;
      }
      this.client.user.setPresence({
        status: this.config.status,
        activities: [
          {
            type: this.config.activityType,
            name: this.config.activity,
          },
        ],
      });
    });

    // Listen to incoming messages
    this.client.on("messageCreate", this.messageHandlerWrapper.bind(this));
  }
}
