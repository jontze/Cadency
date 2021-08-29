import { Role } from ".prisma/client";
import {
  AudioPlayer,
  DiscordGatewayAdapterCreator,
  VoiceConnection,
} from "@discordjs/voice";
import { Message, TextBasedChannels } from "discord.js";
import { MoreVideoDetails } from "ytdl-core";

export interface Command {
  readonly name: string;
  readonly description: string;
  readonly cooldown: number;
  readonly usage: string;
  readonly args: boolean;
  readonly guildOnly: boolean;
  readonly aliases: string[];
  readonly permission: Role;
  execute: (message: Message, args: string[]) => Promise<void>;
}

export interface UrbanDictionary {
  definition: string;
  permalink: string;
  thumbs_up: number;
  sound_urls: string[];
  author: string;
  word: string;
  defid: number;
  current_vote: string;
  written_on: Date;
  example: string;
  thumbs_down: number;
}

export interface IQueueSong {
  textChannel: TextBasedChannels;
  voiceChannelId: string;
  voiceAdapter: DiscordGatewayAdapterCreator;
  connection?: VoiceConnection;
  player?: AudioPlayer;
  songs: MoreVideoDetails[];
  volume: number;
  playing: boolean;
}

export interface ISong {
  textChannel: TextBasedChannels;
  voiceChannelId: string;
  voiceAdapter: DiscordGatewayAdapterCreator;
  info: MoreVideoDetails;
}

export type CommandLoaderType = Partial<Record<COMMAND, Command>>;

export enum COMMAND {
  FIB = "FIB",
  HELP = "HELP",
  INSPIRE = "INSPIRE",
  NOW = "NOW",
  PAUSE = "PAUSE",
  PING = "PING",
  PLAY = "PLAY",
  PURGE = "PURGE",
  RESUME = "RESUME",
  SEARCH = "SEARCH",
  SHOW = "SHOW",
  SKIP = "SKIP",
  SLAP = "SLAP",
  URBAN = "URBAN",
  PREFIX = "PREFIX",
}
