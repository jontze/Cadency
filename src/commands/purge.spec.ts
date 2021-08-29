import Purge from "./purge";
import { Client, Message } from "discord.js";
import { getGuildId, validateVoiceCommand } from "../utils/discord";
import { RawMessageData } from "discord.js/typings/rawDataTypes";

// discord mock
const mockEmit = jest.fn();

jest.mock("discord.js", () => {
  return {
    Message: jest.fn().mockImplementation(() => {
      return {
        client: {
          emit: mockEmit,
        },
      };
    }),
  };
});

jest.mock("../utils/discord");

describe("Purge command", () => {
  let msg: Message;

  beforeEach(() => {
    mockEmit.mockClear();
    msg = new Message({} as unknown as Client, {} as unknown as RawMessageData);
  });

  it("should execute command", async () => {
    expect.assertions(3);
    await Purge.execute(msg, []);
    expect(validateVoiceCommand).toHaveBeenCalled();
    expect(getGuildId).toHaveBeenCalledWith(msg);
    expect(mockEmit).toHaveBeenCalled();
  });
});
