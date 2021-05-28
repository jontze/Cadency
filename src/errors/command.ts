/**
 * Thrown error if something goes wrong during command execution
 */
export class CommandError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CommandError";
  }
}

/**
 * Thrown error if command is GuildOnly and executed in a DM
 * @param  {string} message
 */
export class CommandGuildError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CommandGuildError";
  }
}

/**
 * Thrown error if command requires args but none are given
 * @param  {string} message
 */
export class CommandArgsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CommandArgsError";
  }
}

/**
 * Thrown error if the bot or the user lacks permissions
 * to execute a voice command
 * @param  {string} message
 */
export class CommandVoiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CommandVoiceError";
  }
}

/**
 * Thrown error if the user has not the permission to
 * execute the command
 * @param  {string} message
 */
export class CommandPermissionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CommandPermissionError";
  }
}
