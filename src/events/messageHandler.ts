import { Message } from "discord.js";
import {
  CommandArgsError,
  CommandError,
  CommandGuildError,
  CommandVoiceError,
} from "../errors/command";
import { ParsingError } from "../errors/parser";
import logger from "../logger";
import messageContent from "../message-content";
import { validateCommand } from "../utils/discord";
import {
  getCommandByName,
  hasPrefix,
  parseArgsAndCommand,
} from "../utils/parser";

/**
 * Message handler that receives every message on the server, parse and
 * validate the relevant and execute the command
 * @param  {Message} message Message object
 * @param  {string} prefix Prefix of the server
 */
export const messageHandler = async (
  message: Message,
  prefix: string
): Promise<void> => {
  try {
    if (!hasPrefix(message.content, prefix) || message.author?.bot === true)
      return;
    const { name, args } = parseArgsAndCommand(message.content, prefix);
    logger.info(`Command: "${name}", args: ${args.toString()}`);
    const command = getCommandByName(name);
    validateCommand(command, args, message);
    await command.execute(message, args);
  } catch (error) {
    await messageErrorHandler(error, message);
  }
};

/**
 * Error handler that specifies which errors messages are passed through
 * the user an which are hidden logged to the console
 * @param error Error to handle
 * @param message Message that caused the error
 */
export const messageErrorHandler = async (
  error: any,
  message: Message
): Promise<void> => {
  try {
    if (error instanceof CommandGuildError) {
      await message.channel.send(error.message);
    }
    if (error instanceof CommandArgsError) {
      await message.channel.send(error.message);
    }
    if (error instanceof CommandVoiceError) {
      await message.channel.send(error.message);
    }
    if (error instanceof CommandError || error instanceof ParsingError) {
      await message.channel.send(messageContent.error.command.notFound);
    } else {
      logger.error("Error in MessageHandler", error);
    }
  } catch (err) {
    logger.error("Error in MessageHandler", err);
  }
};
