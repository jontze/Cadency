import { Client, Message } from "discord.js";
import Search from "./search";

import { searchQuery } from "../utils/music";
import { getGuildId, validateVoiceCommand } from "../utils/discord";
import { CommandError } from "../errors/command";
import { RawMessageData } from "discord.js/typings/rawDataTypes";

// Discord mocks
const mockEmit = jest.fn();
const mockMsgSend = jest.fn().mockImplementation(() => {
  return {
    delete: mockMsgDelete,
    awaitReactions: mockMsgAwaitReactions,
  };
});
const mockMsgDelete = jest.fn().mockResolvedValue({});
const mockMsgAwaitReactions = jest.fn().mockImplementation(() => {
  return {
    first: jest.fn().mockImplementation(() => {
      return {
        emoji: {
          name: "1️⃣",
        },
      };
    }),
  };
});

// Music utils mocks
let mockRequestSongInfoResponse: {} | null;
let mockSearchQueryResponse: null | any[];
let mockFilterSearchReactionsResponse: boolean;

jest.mock("discord.js", () => {
  return {
    Message: jest.fn().mockImplementation(() => {
      return {
        guild: {
          voiceAdapterCreator: jest.fn(),
        },
        client: {
          emit: mockEmit,
        },
        channel: {
          send: mockMsgSend,
        },
        member: {
          voice: {
            channel: {
              guild: {
                id: "1",
              },
            },
          },
        },
      };
    }),
  };
});

jest.mock("../utils/music", () => {
  return {
    validateVoiceCommand: jest.fn().mockImplementation(() => {
      return "";
    }),
    getSongInfo: jest.fn().mockImplementation(() => {
      return mockRequestSongInfoResponse;
    }),
    searchQuery: jest.fn().mockImplementation(() => {
      return mockSearchQueryResponse;
    }),
    searchReactions: [
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
    ],
    filterSearchReactions: jest.fn().mockImplementation(() => {
      return mockFilterSearchReactionsResponse;
    }),
  };
});

jest.mock("../utils/discord");
jest.mock("../message-content");

describe("Search command", () => {
  let msg: Message;

  beforeEach(() => {
    // Clear Mocks
    mockEmit.mockClear();
    mockMsgSend.mockClear();
    mockMsgDelete.mockClear();
    mockMsgAwaitReactions.mockClear();

    // Reset mock responses
    mockSearchQueryResponse = [
      {
        title: "TestTitle",
        description: "TestDescription",
        url: "TestUrl",
      },
    ];
    mockFilterSearchReactionsResponse = true;
    mockRequestSongInfoResponse = {};

    msg = new Message({} as unknown as Client, {} as unknown as RawMessageData);
  });

  it("should execute command and emit 'addSong' event", async () => {
    expect.assertions(7);

    await Search.execute(msg, []);

    expect(validateVoiceCommand).toHaveBeenCalled();
    expect(searchQuery).toHaveBeenCalledWith([]);
    expect(mockMsgSend).toHaveBeenCalledTimes(1);
    expect(mockMsgAwaitReactions).toHaveBeenCalled();
    expect(mockMsgDelete).toHaveBeenCalled();
    expect(getGuildId).toHaveBeenCalledWith(msg);
    expect(mockEmit).toHaveBeenCalled();
  });

  it("should execute command and throw error choosed video is out of range", async () => {
    expect.assertions(6);

    mockSearchQueryResponse = [null];

    try {
      await Search.execute(msg, []);
    } catch (e) {
      expect(e instanceof CommandError).toBe(true);
      expect(validateVoiceCommand).toHaveBeenCalled();
      expect(searchQuery).toHaveBeenCalledWith([]);
      expect(mockMsgSend).toHaveBeenCalledTimes(1);
      expect(mockMsgAwaitReactions).toHaveBeenCalled();
      expect(mockMsgDelete).toHaveBeenCalled();
    }
  });
});
