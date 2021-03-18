import { Message, MessageReaction, User } from "discord.js";
import ytdl, { MoreVideoDetails } from "ytdl-core";
import ytsr, { Video } from "ytsr";
import logger from "../logger";

export function validateVoiceChannel(message: Message): boolean {
  if (message.member?.voice.channel == null) {
    message.channel
      .send("You need to be in a voice channel to play music!")
      .catch((err) => logger.error(err));
    return false;
  } else {
    const permission = message.member?.voice.channel.permissionsFor(
      message.client.user != null ? message.client.user : ""
    );
    if (
      permission == null ||
      !permission.has("CONNECT") ||
      !permission.has("SPEAK")
    ) {
      message.channel
        .send("I need the permissions to join and speak in your voice channel!")
        .catch((err) => logger.error(err));
      return false;
    } else {
      return true;
    }
  }
}

export async function requestSongInfo(
  message: Message,
  args: string[]
): Promise<MoreVideoDetails | undefined> {
  if (args.length === 1 && ytdl.validateURL(args[0])) {
    try {
      const videoInfo = await ytdl.getInfo(args[0]);
      return videoInfo.videoDetails;
    } catch (err) {
      logger.error(err);
      return undefined;
    }
  } else {
    try {
      // Search Query with args parameter
      const searchResults = await ytsr(args.join(" "), { limit: 50 });
      let videoUrl: string = "";
      // Loop over the results and get the URL of the first video
      for (const searchElement of searchResults.items) {
        if (videoUrl !== "") break;
        if (searchElement.type === "video") {
          videoUrl = searchElement.url;
        }
      }
      // Request ytdl-VideoInfo
      if (ytdl.validateURL(videoUrl)) {
        const videoInfo = await ytdl.getInfo(videoUrl);
        return videoInfo.videoDetails;
      } else {
        logger.error(`Could't validate url from ytsr-result: '${videoUrl}'`);
        return undefined;
      }
    } catch (err) {
      logger.error(err);
      return undefined;
    }
  }
}

export async function searchQuery(
  args: string[]
): Promise<Video[] | undefined> {
  try {
    const searchResults = await ytsr(args.join(" "), { limit: 100 });
    const top10VideoInfo: Video[] = [];
    for (const searchElement of searchResults.items) {
      if (top10VideoInfo.length === 10) break;
      if (searchElement.type === "video") {
        top10VideoInfo.push(searchElement);
      }
    }
    return top10VideoInfo;
  } catch (err) {
    logger.error(err);
    return undefined;
  }
}

export function filterSearchReactions(
  reaction: MessageReaction,
  user: User
): boolean {
  return searchReactions.includes(reaction.emoji.name);
}

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
