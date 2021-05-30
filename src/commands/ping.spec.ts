import Ping from "./ping";

const mockMsgSend = jest.fn().mockResolvedValue({});

import { Client, Message, TextChannel } from "discord.js";

jest.mock("discord.js", () => {
  return {
    Message: jest.fn().mockImplementation(() => {
      return {
        channel: {
          send: mockMsgSend,
        },
      };
    }),
  };
});

describe("Ping command", () => {
  let msg: Message;

  beforeEach(() => {
    mockMsgSend.mockClear();
    msg = new Message(
      {} as unknown as Client,
      {},
      "" as unknown as TextChannel
    );
  });

  it("should execute command", async () => {
    expect.assertions(1);
    await Ping.execute(msg, []);
    expect(mockMsgSend).toHaveBeenCalledWith("Pong");
  });
});
