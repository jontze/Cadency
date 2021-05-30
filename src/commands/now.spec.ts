import Now from "./now";
import { Client, Message, TextChannel } from "discord.js";
import { getGuildId, validateVoiceCommand } from "../utils/discord";

const mockMsgSend = jest.fn().mockResolvedValue({});
const mockEmit = jest.fn();

jest.mock("discord.js", () => {
  return {
    Message: jest.fn().mockImplementation(() => {
      return {
        channel: {
          send: mockMsgSend,
        },
        client: {
          emit: mockEmit,
        },
      };
    }),
  };
});

jest.mock("../utils/discord");

describe("Now command", () => {
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
    await Now.execute(msg, []);
    expect(validateVoiceCommand).toHaveBeenCalled();
    expect(getGuildId).toHaveBeenCalledWith(msg);
    expect(mockEmit).toHaveBeenCalled();
  });
});
