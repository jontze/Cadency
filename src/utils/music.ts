import { MessageReaction, User } from "discord.js";
import ytdl, { MoreVideoDetails } from "ytdl-core";
import ytsr, { Video } from "ytsr";
import { MusicResultError } from "../errors/music";
import messageContent from "../message-content";

/**
 * Requests video info of given string from youtube
 * @param args Search string array or youtube video url
 * @returns {MoreVideoDetails} VideoDetails
 */
export const getSongInfo = async (
  args: string[]
): Promise<MoreVideoDetails> => {
  if (args.length === 1 && args[0] != null && ytdl.validateURL(args[0])) {
    return (await ytdl.getInfo(args[0])).videoDetails;
  } else {
    // Search Query with args parameter
    const searchResults = await ytsr(args.join(" "), { limit: 50 });
    // Loop over the results and get the URL of the first video
    let videoUrl: string | null = null;
    for (const searchElement of searchResults.items) {
      if (videoUrl != null) break;
      if (searchElement.type === "video") {
        videoUrl = searchElement.url;
      }
    }
    if (videoUrl == null || !ytdl.validateURL(videoUrl))
      throw new MusicResultError(messageContent.error.music.ytsrNoResults);
    return (await ytdl.getInfo(videoUrl)).videoDetails;
  }
};
/**
 * Search in youtube for the 10 best matches of a query
 * @param  {string[]} args Search string
 * @returns {Video[]} Top 10 Videos in Yotube matching the query
 */
export const searchQuery = async (args: string[]): Promise<Video[]> => {
  const searchResults = await ytsr(args.join(" "), { limit: 100 });
  const top10VideoInfo: Video[] = [];
  for (const searchElement of searchResults.items) {
    if (top10VideoInfo.length === 10) break;
    if (searchElement.type === "video") {
      top10VideoInfo.push(searchElement);
    }
  }
  return top10VideoInfo;
};
/**
 * Checks if a given reaction is in a the predifined {@link searchReactions} list
 * @param  {MessageReaction} reaction Reaction to check
 * @param  {User} user Discord user of reaction
 * @returns {boolean}
 */
export const filterSearchReactions = (
  reaction: MessageReaction,
  user: User
): boolean => {
  return searchReactions.includes(reaction.emoji.name);
};

/**
 * List of valid reactions to the search command response
 */
export const searchReactions: string[] = [
  "1️⃣",
  "2️⃣",
  "3️⃣",
  "4️⃣",
  "5️⃣",
  "6️⃣",
  "7️⃣",
  "8️⃣",
  "9️⃣",
  "🔟",
];
