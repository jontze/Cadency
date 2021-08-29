import { Role } from ".prisma/client";
import { Message, Permissions } from "discord.js";
import {
  CommandArgsError,
  CommandGuildError,
  CommandPermissionError,
  CommandVoiceError,
} from "../errors/command";
import messageContent from "../message-content";
import { Command } from "../typings";

/**
 * Extract the guild id from the discord message object or throw an error
 * if `null`
 * @param  {Message} message Message object
 * @returns {string} Id of the discord server
 */
export const getGuildId = (message: Message): string => {
  const guildId = message.guild?.id;
  if (guildId == null) throw new Error("Guild id undefined");
  return guildId;
};

/**
 * Validate the command by checking the user input, user data and throw an
 * error if some data are not valid
 * @param command Command to validate
 * @param args User input
 * @param message Message Object
 */
export const validateCommand = (
  command: Command,
  args: string[],
  message: Message
): void => {
  if (command.guildOnly && message.channel.type !== "GUILD_TEXT") {
    throw new CommandGuildError(messageContent.error.command.guildOnly);
  }
  if (command.args && args.length === 0) {
    throw new CommandArgsError(messageContent.error.command.noArgs);
  }
  if (
    command.permission === Role.ADMIN &&
    !message.member?.permissions.has(Permissions.FLAGS.ADMINISTRATOR)
  ) {
    throw new CommandPermissionError(messageContent.error.command.noPermission);
  }
};

/**
 * Validate a voice command, by validate the usual stuff {@link validateCommand}
 * and validate voice permissions of the bot and the user. If something is not
 * valid an error is thrown.
 * @param  {Command} command VoiceCommand to validate
 * @param  {string[]} args User input
 * @param  {Message} message Message Object
 */
export const validateVoiceCommand = (
  command: Command,
  args: string[],
  message: Message
): void => {
  validateCommand(command, args, message);
  if (message.member?.voice.channel == null) {
    throw new CommandVoiceError(messageContent.error.command.voice.noChannel);
  }
  const permission = message.member.voice.channel.permissionsFor(
    message.client.user ?? ""
  );
  if (
    permission == null ||
    !permission.has("CONNECT") ||
    !permission.has("SPEAK")
  ) {
    throw new CommandVoiceError(
      messageContent.error.command.voice.noPermission
    );
  }
};

/**
 * Checks with a regex if the new prefix is valid
 * @param  {string} newPrefix Next prefix
 * @returns Boolean
 */
export const isNewPrefixValid = (newPrefix: string): boolean => {
  if (newPrefix.match(/^[!?%&()"=#'*<>]{1,3}$/gm)) return true;
  return false;
};
