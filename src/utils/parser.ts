import { CommandError } from "../errors/command";
import { ParsingError } from "../errors/parser";
import CommandLoader from "../cadency/constants/CommandLoader";
import { Command, COMMAND } from "../typings";
import messageContent from "../message-content";

/**
 * Checks if a message string has a prefix
 * @param  {string} messageString Message content
 * @param  {string} prefix Prefix of the server to check
 * @returns {boolean}
 */
export const hasPrefix = (messageString: string, prefix: string): boolean => {
  if (messageString.startsWith(prefix)) {
    return true;
  }
  return false;
};

/**
 * Retrieve the command name and provided arguments from the message string
 * @param  {string} messageString Message content
 * @param  {string} prefix Prefix of the server
 * @returns {{name: string, args: string[]}} Object with command name and arguments
 */
export const parseArgsAndCommand = (
  messageString: string,
  prefix: string
): {
  name: string;
  args: string[];
} => {
  const msgWithoutPrefix = removePrefixFromMessage(messageString, prefix);
  return {
    name: parseCommand(msgWithoutPrefix),
    args: parseArgs(msgWithoutPrefix),
  };
};

/**
 * Remove the prefix of the user message
 * @param  {string} messageString Complete user message with command and prefix
 * @param  {string} prefix Prefix to detect
 * @returns {sttring} Message without prefix
 */
export const removePrefixFromMessage = (
  messageString: string,
  prefix: string
): string => {
  return messageString.slice(prefix.length);
};

/**
 * Extract the command name from the user message
 * @param  {string} messageString User message with command at beginning
 * @returns {string} Command name
 */
export const parseCommand = (messageString: string): string => {
  const commandName = messageString.split(/ +/)[0];
  if (commandName == null)
    throw new ParsingError(messageContent.error.parser.cmdNull);
  return commandName.toUpperCase();
};

/** Extract the provides arguments of the user message
 * @param  {string} messageString User message with command at beginning
 * @returns {string[]} Provided message arguments as array
 */
export const parseArgs = (messageString: string): string[] => {
  return messageString.split(/ +/).slice(1);
};

/**
 * Returns a command object by the given command name
 * @param  {string} commandName Name of the command
 * @returns {Command} Command object
 */
export const getCommandByName = (commandName: string): Command => {
  if (commandName in COMMAND) {
    return CommandLoader[commandName as COMMAND];
  }
  throw new CommandError(messageContent.error.command.notFound);
};
