import Help from "./help";

const mockMsgSend = jest.fn().mockResolvedValue({});

import { Client, Message, TextChannel } from "discord.js";

jest.mock("discord.js", () => {
  return {
    Message: jest.fn().mockImplementation(() => {
      return {
        channel: {
          send: mockMsgSend,
        },
        author: {
          send: mockMsgSend,
        },
      };
    }),
  };
});
jest.mock("../message-content");

describe("Help command", () => {
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
    await Help.execute(msg, []);
    expect(mockMsgSend).toHaveBeenCalledTimes(2);
  });
});
