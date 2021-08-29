import { MessageReaction, User } from "discord.js";
import {
  filterSearchReactions,
  getSongInfo,
  searchQuery,
  searchReactions,
} from "./music";
import ytsr from "ytsr";
import { getInfo, validateURL } from "ytdl-core";
import { MusicResultError } from "../errors/music";
import messageContent from "../message-content";

// Ytsr mocks
let mockYtsrResponse: any = null;

// Ytdl mocks
let mockValidateUrlResponse: null | boolean = null;
let mockGetInfoResponse: any = null;

jest.mock("discord.js");

jest.mock("ytsr", () => {
  return jest.fn(() => {
    return mockYtsrResponse;
  });
});

jest.mock("ytdl-core", () => ({
  validateURL: jest.fn().mockImplementation(() => {
    return mockValidateUrlResponse;
  }),
  getInfo: jest.fn().mockImplementation(() => {
    return mockGetInfoResponse;
  }),
}));

jest.mock("../logger");

describe("Music utils", () => {
  beforeEach(() => {
    mockValidateUrlResponse = null;
    mockGetInfoResponse = null;
    mockYtsrResponse = null;
    jest.clearAllMocks();
  });

  it("should find reaction in array", () => {
    const filterRes = filterSearchReactions(
      {
        emoji: {
          name: searchReactions[0],
        },
      } as unknown as MessageReaction,
      {} as unknown as User
    );
    expect(filterRes).toBe(true);
  });

  it("should not find reaction in array", () => {
    const filterRes = filterSearchReactions(
      {
        emoji: {
          name: "RandomReaction",
        },
      } as unknown as MessageReaction,
      {} as unknown as User
    );
    expect(filterRes).toBe(false);
  });

  it("should return false if reaction emoji name is null", () => {
    const filterRes = filterSearchReactions(
      {
        emoji: {},
      } as unknown as MessageReaction,
      {} as unknown as User
    );
    expect(filterRes).toBe(false);
  });

  it("should search a query and return results", async () => {
    expect.assertions(3);
    const dummyQuery = ["test query"];
    const dummyResponse = {
      items: [
        {
          type: "video",
        },
      ],
    };
    mockYtsrResponse = dummyResponse;

    const queryResult = await searchQuery(dummyQuery);

    expect(ytsr).toHaveBeenCalledWith(dummyQuery.join(" "), { limit: 100 });
    expect(queryResult).toBeDefined();
    expect(queryResult).toEqual(dummyResponse.items);
  });

  it("should get song info by URL and return video details", async () => {
    expect.assertions(4);
    const dummyArgs = ["test-url-query"];
    const dummyYtdlResponse = {
      videoDetails: "VIDEO-DETAILS",
    };
    mockValidateUrlResponse = true;
    mockGetInfoResponse = Promise.resolve(dummyYtdlResponse);

    const videoDetails = await getSongInfo(dummyArgs);

    expect(validateURL).toHaveBeenCalledWith(dummyArgs[0]);
    expect(getInfo).toHaveBeenLastCalledWith(dummyArgs[0]);
    expect(videoDetails).toBeDefined();
    expect(videoDetails).toEqual(dummyYtdlResponse.videoDetails);
  });

  it("should get song info by search string and return video details", async () => {
    expect.assertions(6);
    const dummyArgs = ["test", "search", "query"];
    const dummyYtdlResponse = {
      videoDetails: "VIDEO-DETAILS",
    };
    const dummyResponse = {
      items: [
        {
          type: "video",
          url: "video-url",
        },
      ],
    };
    mockValidateUrlResponse = true;
    mockYtsrResponse = Promise.resolve(dummyResponse);
    mockGetInfoResponse = Promise.resolve(dummyYtdlResponse);

    const videoDetails = await getSongInfo(dummyArgs);

    expect(validateURL).toHaveBeenCalledWith(dummyResponse.items[0]!.url);
    expect(ytsr).toHaveBeenCalledWith(dummyArgs.join(" "), { limit: 50 });
    expect(validateURL).toHaveBeenCalledTimes(1);
    expect(getInfo).toHaveBeenCalledWith(dummyResponse.items[0]!.url);
    expect(videoDetails).toBeDefined();
    expect(videoDetails).toEqual(dummyYtdlResponse.videoDetails);
  });

  it("should get song info by search string and throw MusicResultError if ytsr return no items", async () => {
    expect.assertions(3);
    const dummyArgs = ["test", "search", "query"];
    const dummyResponse = {
      items: [],
    };
    mockValidateUrlResponse = false;
    mockYtsrResponse = Promise.resolve(dummyResponse);
    try {
      await getSongInfo(dummyArgs);
    } catch (e) {
      const isMusicResultError = e instanceof MusicResultError;
      expect(isMusicResultError).toBe(true);
      if (isMusicResultError) {
        expect(e.message).toBe(messageContent.error.music.ytsrNoResults);
        expect(ytsr).toHaveBeenCalledWith(dummyArgs.join(" "), { limit: 50 });
      }
    }
  });
});
