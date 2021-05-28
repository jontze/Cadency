import { Command, ISong } from "../typings";
import { Role } from ".prisma/client";
import {
  filterSearchReactions,
  getSongInfo,
  searchQuery,
  searchReactions,
} from "../utils/music";
import { getGuildId, validateVoiceCommand } from "../utils/discord";
import messageContent from "../message-content";
import { CommandError } from "../errors/command";

/**
 * Command to search in youtube for a video / song by a query
 */
const Search: Command = {
  name: "search",
  description: "Search a video on YouTube by the given query.",
  args: true,
  cooldown: 10,
  usage: "<search-query>",
  aliases: [],
  guildOnly: true,
  permission: Role.MEMBER,
  execute: async (message, args): Promise<void> => {
    // TODO: Change command so bot is waiting for a
    // valid response message (e.g. `1`) instead a reaction
    validateVoiceCommand(Search, args, message);
    const videoTop10 = await searchQuery(args);
    // Send Message and handle reactions
    const embedMessage = await message.channel.send(
      messageContent.command.searchResults(videoTop10)
    );
    // Remove List after 70 seconds
    const deleteTimeout = setTimeout(async () => {
      await embedMessage.delete();
    }, 70000);
    // Wait for a valid reaction
    const awaitedReactions = await embedMessage.awaitReactions(
      filterSearchReactions,
      { max: 1, time: 60000, errors: ["time"] }
    );
    const emojiIndex = searchReactions.indexOf(
      awaitedReactions.first()?.emoji.name ?? ""
    );
    if (emojiIndex >= 0) {
      // Delete Search-result Message, request song info and play or add to queue
      await embedMessage.delete();
      clearTimeout(deleteTimeout);
      if (videoTop10[emojiIndex] == null)
        throw new CommandError(`:x: No song found at position ${emojiIndex}`);
      // Ensured not to be null as it is checked above
      const choosedVideoUrl = videoTop10[emojiIndex]!.url;
      const videoInfo = await getSongInfo([choosedVideoUrl]);
      const song: ISong = {
        textChannel: message.channel,
        // Ensured not to be null as it is checked in "validateVoiceCommand"
        voiceChannel: message.member!.voice.channel!,
        info: videoInfo,
      };
      message.client.emit("addSong", song, getGuildId(message), message);
    } else {
      await message.channel.send(messageContent.command.searchReactionFailed);
    }
  },
};

export default Search;
