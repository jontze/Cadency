import Purge from "./purge";
import { Client, Message, TextChannel } from "discord.js";
import { getGuildId, validateVoiceCommand } from "../utils/discord";

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
    msg = new Message(
      {} as unknown as Client,
      {},
      "" as unknown as TextChannel
    );
  });

  it("should execute command", async () => {
    expect.assertions(3);
    await Purge.execute(msg, []);
    expect(validateVoiceCommand).toHaveBeenCalled();
    expect(getGuildId).toHaveBeenCalledWith(msg);
    expect(mockEmit).toHaveBeenCalled();
  });
});
