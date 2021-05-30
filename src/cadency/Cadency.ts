import { Collection, Message } from "discord.js";
import ytdl from "ytdl-core";
import logger from "../logger";

import messageContent from "../message-content";
import { ISong, IQueueSong } from "../typings";
import { updatePrefixOfServer } from "../utils/database";
import { isNewPrefixValid } from "../utils/discord";
import Base from "./Base";
import Config from "./Config";

/**
 * Cadency bot class with all advanced events and functionalities
 * @param  {Config} config Configuration class
 */
export default class Cadency extends Base {
  protected readonly songList: Collection<string, IQueueSong> =
    new Collection();

  constructor(config: Config) {
    super(config);
    this.constructMusicEventHandler();
    this.constructPersistentEventHandler();
  }

  /**
   * Set up all event handlers for custom events that change the database
   */
  private constructPersistentEventHandler(): void {
    this.client.on("updatePrefix", this.updatePrefixHandler.bind(this));
  }

  /**
   * Set up all event handlers for custom music related events
   */
  private constructMusicEventHandler(): void {
    this.client.on("addSong", this.addSongHandler.bind(this));

    this.client.on("skipSong", this.skipSongHandler.bind(this));

    this.client.on("showPlaylist", this.showPlaylistHandler.bind(this));

    this.client.on("purgePlaylist", this.purgePlaylistHandler.bind(this));

    this.client.on("pauseSong", this.pauseSongHandler.bind(this));

    this.client.on("resumeSong", this.resumeSongHandler.bind(this));

    this.client.on("currentSong", this.currentSongHandler.bind(this));
  }

  /**
   * Event handler for `addSong` to add songs to the playlist and play
   * if it is the first song added to the list
   * @param  {ISong} song Song and channel information
   * @param  {string} guildId Discord server id
   * @param  {Message} message Message object
   * @returns Promise
   */
  private async addSongHandler(
    song: ISong,
    guildId: string,
    message: Message
  ): Promise<void> {
    const serverSongs = this.songList.get(guildId);
    if (serverSongs == null) {
      const listedSong: IQueueSong = {
        textChannel: song.textChannel,
        voiceChannel: song.voiceChannel,
        songs: [],
        volume: 5,
        playing: false,
      };
      listedSong.songs.push(song.info);
      this.songList.set(guildId, listedSong);
      await message.channel.send(messageContent.song.add(song));
      // play song
      this.playGuildPlaylist(guildId);
    } else {
      serverSongs.songs.push(song.info);
      await message.channel.send(messageContent.song.add(song));
    }
  }

  /**
   * Event handler for `skipSong` to skip the current playing
   * song in the playlist
   * @param  {string} guildId Discord server id
   * @param  {Message} message Message object
   * @returns Promise
   */
  private async skipSongHandler(
    guildId: string,
    message: Message
  ): Promise<void> {
    const guildData = this.songList.get(guildId);
    if (guildData?.connection != null && guildData.songs.length > 0) {
      guildData.connection.dispatcher.end();
      await message.channel.send(messageContent.song.skiped);
      return;
    }
    await message.channel.send(messageContent.song.skipFailed);
  }

  /**
   * Event handler for `showPlaylist` to show the whole songs in the
   * current playlist of the server
   * @param  {string} guildId Discord server id
   * @param  {Message} message Message object
   * @returns Promise
   */
  private async showPlaylistHandler(
    guildId: string,
    message: Message
  ): Promise<void> {
    const guildData = this.songList.get(guildId);
    if (
      guildData == null ||
      guildData.songs.length === 0 ||
      guildData.connection == null
    ) {
      await message.channel.send(messageContent.song.showPlaylistFailed);
      return;
    }
    await message.channel.send(
      messageContent.song.showPlaylist(guildData.songs)
    );
  }

  /**
   * Event handler for `purgePlaylist` to clear the entire list of songs
   * of the server and remove also the current playing song. Music will
   * stop playing.
   * @param  {string} guildId Discord server id
   * @param  {Message} message Message object
   * @returns Promise
   */
  private async purgePlaylistHandler(
    guildId: string,
    message: Message
  ): Promise<void> {
    const guildData = this.songList.get(guildId);
    if (
      guildData == null ||
      guildData?.connection == null ||
      guildData.songs.length === 0
    ) {
      await message.channel.send(messageContent.song.purgeFailed);
      return;
    }
    guildData.songs.length = 0;
    guildData.connection.dispatcher.end();
    guildData.playing = false;
    await message.channel.send(messageContent.song.purge);
  }

  /**
   * Event handler for `pauseSong` to pause the currentplaying song
   * of the server
   * @param  {string} guildId Discord server id
   * @param  {Message} message Message object
   * @returns Promise
   */
  private async pauseSongHandler(
    guildId: string,
    message: Message
  ): Promise<void> {
    const guildData = this.songList.get(guildId);
    if (
      guildData == null ||
      guildData.songs[0] == null ||
      guildData.connection == null
    ) {
      await message.channel.send(messageContent.song.pauseFailed);
      return;
    }
    guildData.connection.dispatcher.pause();
    guildData.playing = false;
    await message.channel.send(messageContent.song.pause);
  }

  /**
   * Event handler for `resumeSong` to continue the current
   * paused song of the server
   * @param  {string} guildId Discord server id
   * @param  {Message} message Message object
   * @returns Promise
   */
  private async resumeSongHandler(
    guildId: string,
    message: Message
  ): Promise<void> {
    const guildData = this.songList.get(guildId);
    if (
      guildData == null ||
      guildData.songs[0] == null ||
      guildData.connection == null
    ) {
      await message.channel.send(messageContent.song.resumeFailed);
      return;
    }
    if (guildData.playing && !guildData.connection.dispatcher.paused) {
      await message.channel.send(messageContent.song.resumeFailedPlaying);
      return;
    }
    guildData.connection.dispatcher.resume();
    guildData.playing = true;
    await message.channel.send(messageContent.song.resume);
  }

  /**
   * Event handler for `currentSong` to show informations about the song
   * that is currently played or paused on the server
   * @param  {string} guildId Discord server id
   * @param  {Message} message Message object
   * @returns Promise
   */
  private async currentSongHandler(
    guildId: string,
    message: Message
  ): Promise<void> {
    const guildData = this.songList.get(guildId);
    if (guildData == null || guildData.songs[0] == null) {
      await message.channel.send(messageContent.song.showFailed);
      return;
    }
    await message.channel.send(messageContent.song.show(guildData.songs[0]));
  }

  /**
   * Play the playlist of the given server and leave if queue is empty
   * @param  {string} guildId Discord server id
   * @returns Promise
   */
  private async playGuildPlaylist(guildId: string): Promise<void> {
    const songList = this.songList.get(guildId);
    if (songList == null || songList.songs[0] == null) return;
    songList.connection = await songList.voiceChannel.join();
    songList.playing = true;
    const stream = songList.connection.play(ytdl(songList.songs[0].video_url));
    stream.on("finish", () => {
      songList.songs.shift();
      if (songList.songs.length === 0) {
        this.songList.delete(guildId);
        songList.voiceChannel.leave();
      }
      this.playGuildPlaylist(guildId);
    });
    stream.on("error", (err: any) => {
      logger.error("Error during ytdl play", err);
      songList.songs.shift();
      if (songList.songs.length === 0) {
        this.songList.delete(guildId);
        songList.voiceChannel.leave();
      }
    });
  }

  /**
   * Event handler for `updatePrefix` to change the current used prefix for
   * the bot in the given server
   * @param  {Message} message Message object
   * @param  {string} guildId Discord server id
   * @param  {string[]} args Arguements containing new prefix
   * @returns Promise
   */
  private async updatePrefixHandler(
    message: Message,
    guildId: string,
    args: string[]
  ): Promise<void> {
    /* args[0] is for sure not null as it was already checked before
     * the event emits
     */
    if (!isNewPrefixValid(args[0]!)) {
      await message.channel.send(messageContent.bot.prefixInvalid);
      return;
    }
    try {
      await message.channel.send(
        messageContent.bot.prefix(
          (
            await updatePrefixOfServer(
              guildId,
              this.db,
              args,
              message.guild?.name
            )
          ).prefix
        )
      );
    } catch (e) {
      logger.error("Error on prefix update", e);
      await message.channel.send(messageContent.bot.prefixFailed);
    }
  }
}
