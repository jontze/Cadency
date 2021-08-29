import { MessageEmbed } from "discord.js";
import { MoreVideoDetails } from "ytdl-core";
import { Video } from "ytsr";
import { DEFAULT_COLOR } from "../cadency/constants/Cadency.constants";
import { COMMAND, ISong } from "../typings";
import { searchReactions } from "../utils/music";
import { getCommandByName } from "../utils/parser";

/**
 * Object with all messages the bot will send to the users or to the servers
 */
export default {
  bot: {
    start: "Start amazing things...",
    prefix: (newPrefix: string): string =>
      `:white_check_mark: **Prefix successfully changed to \`${newPrefix}\`**`,
    prefixFailed: ":x: **Failed to change the prefix**",
    prefixInvalid:
      ":x: **The prefix is invalid.\nIt cannot be longer than 3 characters and must consist of the following characters `!?%&()\"=#'*` ** ",
  },
  song: {
    /**
     * Message if a song is added to an empty queue
     * @param {ISong} song
     * @returns {string} Message
     */
    addFirst: (song: ISong): string => {
      return `:white_check_mark: **Joined** <#${song.voiceChannelId}>\n**Playing** :notes: \`${song.info.video_url}\` \n:newspaper: \`${song.info.title}\``;
    },
    /**
     * Message if a song is added to an existing queue
     * @param  {ISong} song
     * @returns Message
     */
    add: (song: ISong): string => {
      return `:white_check_mark: Added song to the queue \n**Playing** :notes: \`${song.info.video_url}\` \n:newspaper: \`${song.info.title}\``;
    },
    /**
     * Message to show the current playing song
     * @param  {MoreVideoDetails} song
     * @returns Message
     */
    show: (song: MoreVideoDetails): string => {
      return `:notes: Playing \`${song.title}\``;
    },
    showFailed: ":x: **No song is playing...**",
    skiped: ":fast_forward: **Skipped**",
    skipFailed: ":x: **I can't skip...no music is in the queue.**",
    pause: ":pause_button: **Paused**",
    pauseFailed: ":x: **I can't pause...no music is playing.**",
    resume: ":play_pause: **Resumed**",
    resumeFailed: ":x: **There is nothing to resume.**",
    resumeFailedPlaying: ":x: **The music is already playing...**",
    purge:
      ":white_check_mark: :wastebasket: **Successfully cleared the playlist**",
    purgeFailed: ":no_entry_sign: **The playlist is already empty**",
    /**
     * Styled Message to show all songs in the current queue
     * @param  {MoreVideoDetails[]} songs
     * @returns {MessageEmbed} MessageEmbed
     */
    showPlaylist: (songs: MoreVideoDetails[]): MessageEmbed => {
      const embed = new MessageEmbed();
      embed.setColor(DEFAULT_COLOR);
      embed.setTitle("Playlist");
      songs.forEach((song, index) => {
        embed.addField(
          `${index + 1}. :newspaper: \`${song.title}\``,
          `:notes: \`${song.video_url}\``
        );
      });
      return embed;
    },
    showPlaylistFailed: ":no_entry_sign: **No songs in the queue**",
  },
  command: {
    pong: "Pong",
    /**
     * Message if the fib command input is not a number
     * @param {string} User input
     * @returns {string} Message
     */
    fibFail: (input: string): string =>
      `**Is \`${input}\` really a valid number?**`,
    /**
     * Message if the user want to slap himself
     * @param  {string} authorName Name of user
     * @returns {string} Message
     */
    slapYourself: (authorName: string): string =>
      `**Why do you want to slap yourself, ${authorName}?**`,
    /**
     * Message if the user want to slap the bot
     * @param  {string} botId ID of bot
     * @param  {string} authorName Name of user
     * @returns {string} Message
     */
    slapBot: (botId: string, authorName: string): string =>
      `**Nope!\n${botId} slaps ${authorName} around a bit with a large trout!**`,
    /**
     * Message if the user want to slap another user
     * @param  {string} authorName Name of user
     * @param  {string} targetName Name of target user
     * @returns {string} Message
     */
    slap: (authorName: string, targetName: string): string =>
      `**${authorName} slaps ${targetName} around a bit with a large trout!**`,
    /**
     * Message to inform the user about an incoming help DM
     * @param  {string} authorName Name of user
     * @returns {string} Message
     */
    helpDM: (authorName: string): string =>
      `**I send you a DM with a list of my commands, ${authorName}**`,
    /**
     * Styled help message to inform the user about all commands
     * @returns {MessageEmbed} MessageEmbed
     */
    help: (): MessageEmbed => {
      const embed = new MessageEmbed();
      embed.setColor(DEFAULT_COLOR);
      embed.setTitle("A list of all commands");
      Object.keys(COMMAND).forEach((cmdName, index) => {
        const cmd = getCommandByName(cmdName);
        const cooldownMsg =
          cmd.aliases.length === 0
            ? ""
            : `\naliases: ${cmd.aliases.join(", ")}`;
        embed.addField(
          `${index + 1}. ${cmd.description}`,
          `${cmd.name} ${cmd.usage}\ncooldown: ${cmd.cooldown} ${cooldownMsg}`
        );
      });
      return embed;
    },
    /**
     * Styled message to show all search results to the user
     * @param  {Video[]} videoResults Video search results from youtube
     * @returns {MessageEmbed} MessageEmbed
     */
    searchResults: (videoResults: Video[]): MessageEmbed => {
      const embed = new MessageEmbed();
      embed.setColor(DEFAULT_COLOR);
      embed.setTitle("**Top 10 search results**");
      embed.setFooter("**React with a number to choose your song.**");
      videoResults.forEach((video, index) => {
        embed.addField(
          `${searchReactions[index]}. ${video.title}`,
          `${video.description}`
        );
      });
      return embed;
    },
    searchReactionFailed: ":x: **I don't know what to do with this reaction!**",
    playFailed: ":x: **Invalid voice channel!**",
  },
  error: {
    fatal:
      ":poop: :airplane_small: **Fecal matter just hits the rotary air impeller!**",
    command: {
      notFound: ":x: **Command not found**",
      guildOnly:
        ":no_entry_sign: **This command can only be executed on a server**",
      noArgs: ":x: **The command requires some arguments**",
      noPermission:
        ":no_entry_sign: **You have not the permission to execute the command**",
      voice: {
        noChannel:
          ":x: **You need to be in a voice channel to execute the command**",
        noPermission:
          ":no_entry_sign: **I need the permissions to join and speak in your voice channel!**",
      },
    },
    music: {
      ytsrNoResults: ":x: **YouTube search showed no results**",
    },
    parser: {
      cmdNull: ":x: **Command name undefined**",
    },
  },
};
