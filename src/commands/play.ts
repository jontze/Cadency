import { Command, QueueSong } from "../typings";
import * as music from "../utils/music";
import logger from "../logger";

const Play: Command = {
  name: "play",
  description: "Play a song from youtube by URL.",
  args: true,
  cooldown: 10,
  usage: "<youtube-video-url>",
  aliases: [],
  guildOnly: true,
  execute(message, args) {
    const voiceChannelUser = message.member?.voice.channel;

    if (music.validateVoiceChannel(message)) {
      music
        .requestSongInfo(message, args)
        .then((videoInfo) => {
          if (videoInfo === undefined) {
            message.channel
              .send("Invalid Youtube-Link!")
              .catch((err) => logger.error(err));
          } else {
            const serverQueue: QueueSong = {
              textChannel: message.channel,
              voiceChannel: voiceChannelUser,
              connection: null,
              songs: [],
              volume: 5,
              playing: false,
            };
            serverQueue.songs.push(videoInfo);
            message.client.emit(
              "addSong",
              serverQueue,
              voiceChannelUser?.guild.id,
              message
            );
          }
        })
        .catch((err) => logger.error(err));
    }
  },
};

export default Play;
