import { Command, ISong } from "../typings";
import { getSongInfo } from "../utils/music";
import { Role } from ".prisma/client";
import { getGuildId, validateVoiceCommand } from "../utils/discord";
import messageContent from "../message-content";

/**
 * Command to play a song from a youtube video directly by url or
 * by the first best match of a search query
 */
const Play: Command = {
  name: "play",
  description: "Play a song from youtube by URL.",
  args: true,
  cooldown: 10,
  usage: "<youtube-video-url>",
  aliases: [],
  guildOnly: true,
  permission: Role.MEMBER,
  execute: async (message, args): Promise<void> => {
    validateVoiceCommand(Play, args, message);
    const videoInfo = await getSongInfo(args);
    let voiceChannel = message.member?.voice.channel;
    if (voiceChannel != null && message.guild?.voiceAdapterCreator != null) {
      const song: ISong = {
        textChannel: message.channel,
        voiceChannelId: voiceChannel.id,
        voiceAdapter: message.guild.voiceAdapterCreator,
        info: videoInfo,
      };
      message.client.emit("addSong", song, getGuildId(message), message);
    } else {
      await message.channel.send(messageContent.command.playFailed);
    }
  },
};

export default Play;
