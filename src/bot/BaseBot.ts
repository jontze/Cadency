import { Collection, Client, Message } from "discord.js";

import { BotConfig, Commands, QueueSong, Command } from "../typings";
import commands from "../commands";
import logger from "../logger";

export default class BaseBot {
  protected readonly token: string;
  protected readonly client: Client;
  protected readonly commands: Commands;
  protected readonly cooldowns: Collection<string, Collection<string, number>>;
  protected readonly songList: Collection<string, QueueSong>;
  protected readonly config: BotConfig = {
    prefix: "/",
    activity: "Listen to some music",
    activityType: "CUSTOM_STATUS",
    status: "online",
  };

  constructor(token: string, config?: BotConfig) {
    this.token = token;
    if (config !== undefined) this.setConfig(config);
    this.commands = commands;
    this.client = new Client();
    this.cooldowns = new Collection();
    this.songList = new Collection();
  }

  private setConfig(config: BotConfig): void {
    this.config.prefix = config.prefix ?? this.config.prefix;
    this.config.activity = config.activity ?? this.config.activity;
    this.config.activityType = config.activityType ?? this.config.activityType;
    this.config.status = config.status ?? this.config.status;
  }

  protected parseArgsAndCommand(message: Message): [string[], string] {
    const args = message.content
      .slice(this.config.prefix.length)
      .split(/ +/)
      .slice(1);
    const commandName = message.content
      .slice(this.config.prefix.length)
      .split(/ +/)[0]
      .toLowerCase();
    logger.info(`Command: ${commandName}, args: ${args.join(" ")}`);
    return [args, commandName];
  }

  protected getCommand(name: string): Command | undefined {
    return this.commands[name] ?? this.searchAliases(name);
  }

  protected searchAliases(name: string): Command | undefined {
    const command = undefined;
    for (const key in this.commands) {
      if (this.commands[key].aliases.includes(name)) {
        return this.commands[key];
      }
    }
    return command;
  }

  protected checkGuildOnly(command: Command, message: Message): void {
    if (command.guildOnly && message.channel.type !== "text") {
      message
        .reply("I can't execute that command inside DMs!")
        .catch((err) => logger.error(err));
    }
  }

  protected checkArgsRequired(
    command: Command,
    args: string[],
    message: Message
  ): void {
    if (command.args && args.length === 0) {
      let reply = `You didn't provide any arguments, @${message.author.toString()}!`;
      reply += `\nThe proper usage would be: \`${this.config.prefix}${command.name} ${command.usage}\``;
      message.channel.send(reply).catch((err) => logger.error(err));
    }
  }

  protected hasCooldown(command: Command, message: Message): boolean {
    // Add Command to Collection if never used
    if (!this.cooldowns.has(command.name)) {
      this.cooldowns.set(command.name, new Collection());
    }
    const now = Date.now();
    const cooldownAmount = command.cooldown * 1000;
    // Check if Author already in collection
    if (this.cooldowns.get(command.name)?.has(message.author.id) === true) {
      // Check if cooldown passed
      const expirationTime =
        (this.cooldowns.get(command.name)?.get(message.author.id) as number) +
        cooldownAmount;
      if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000;
        message
          .reply(
            `please wait ${timeLeft.toFixed(
              1
            )} more second(s) before reusing the \`${command.name}\` command.`
          )
          .catch((err) => logger.error(err));
        return true;
      }
    }
    // Set Timestamp in cooldown collection
    this.cooldowns.get(command.name)?.set(message.author.id, now);
    // Delete entry after cooldown
    setTimeout(
      () => this.cooldowns.get(command.name)?.delete(message.author.id),
      cooldownAmount
    );
    return false;
  }
}
