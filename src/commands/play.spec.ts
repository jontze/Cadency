import { Client, Message } from "discord.js";
import Play from "./play";
import { getGuildId, validateVoiceCommand } from "../utils/discord";
import { RawMessageData } from "discord.js/typings/rawDataTypes";

// Discord mocks
const mockEmit = jest.fn();
const mockMsgSend = jest.fn().mockResolvedValue({});

// Music utils mocks
let mockValidateVoiceResponse: boolean;
let mockGetSongInfoResponse: {} | null;

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
      return mockValidateVoiceResponse;
    }),
    getSongInfo: jest.fn().mockImplementation(() => {
      return mockGetSongInfoResponse;
    }),
  };
});
jest.mock("../utils/discord");

describe("Play command", () => {
  let msg: Message;

  beforeEach(() => {
    mockValidateVoiceResponse = true;
    mockGetSongInfoResponse = Promise.resolve({});

    mockEmit.mockClear();
    mockMsgSend.mockClear();
    msg = new Message({} as unknown as Client, {} as unknown as RawMessageData);
  });

  it("should execute command and emit 'addSong' event", async () => {
    expect.assertions(3);

    await Play.execute(msg, []);

    expect(validateVoiceCommand).toHaveBeenCalled();
    expect(getGuildId).toHaveBeenCalledWith(msg);
    expect(mockEmit).toHaveBeenCalled();
  });
});
