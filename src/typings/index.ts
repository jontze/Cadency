import {
  Message,
  ActivityType,
  TextChannel,
  DMChannel,
  NewsChannel,
  VoiceChannel,
  VoiceConnection,
  PresenceData,
} from "discord.js";
import { MoreVideoDetails } from "ytdl-core";

export interface BotInterface {
  start: () => void;
}

export interface BotConfig {
  prefix: string;
  activity: string;
  activityType: ActivityType;
  status: PresenceData["status"];
}

export interface Command {
  readonly name: string;
  readonly description: string;
  readonly cooldown: number;
  readonly usage: string;
  readonly args: boolean;
  readonly guildOnly: boolean;
  readonly aliases: string[];
  execute: (message: Message, args: string[]) => void;
}

export type Commands = {
  [name in string]: Command;
};

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

export interface QueueSong {
  textChannel: TextChannel | DMChannel | NewsChannel;
  voiceChannel: VoiceChannel | null | undefined;
  connection: VoiceConnection | null;
  songs: MoreVideoDetails[];
  volume: number;
  playing: boolean;
}
