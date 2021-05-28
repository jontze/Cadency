import Pause from "./pause";
import { Client, Message, TextChannel } from "discord.js";
import { getGuildId, validateVoiceCommand } from "../utils/discord";

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

describe("Pause command", () => {
  let msg: Message;

  beforeEach(() => {
    jest.clearAllMocks();
    mockEmit.mockClear();
    msg = new Message(
      {} as unknown as Client,
      {},
      "" as unknown as TextChannel
    );
  });

  it("should execute command", async () => {
    expect.assertions(3);
    await Pause.execute(msg, []);
    expect(validateVoiceCommand).toHaveBeenCalled();
    expect(getGuildId).toHaveBeenCalledWith(msg);
    expect(mockEmit).toHaveBeenCalled();
  });
});
