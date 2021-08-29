import Slap from "./slap";

const mockMsgSend = jest.fn().mockResolvedValue({});
const mockAuthor = {
  toString: jest.fn(),
};

import { Client, Message } from "discord.js";
import { RawMessageData } from "discord.js/typings/rawDataTypes";

const botId = "botId";

jest.mock("discord.js", () => {
  return {
    Message: jest.fn().mockImplementation(() => {
      return {
        channel: {
          send: mockMsgSend,
        },
        author: mockAuthor,
        client: {
          user: {
            toString: () => botId,
          },
        },
      };
    }),
  };
});

describe("Slap command", () => {
  let msg: Message;

  const dummyAuthor = "<@1234>";
  const dummyUser = "<@4321>";

  beforeEach(() => {
    mockMsgSend.mockClear();
    mockAuthor.toString.mockClear();
    msg = new Message({} as unknown as Client, {} as unknown as RawMessageData);
  });

  it("should execute command and try to slap yourself", async () => {
    expect.assertions(1);
    mockAuthor.toString.mockReturnValue(dummyAuthor);
    await Slap.execute(msg, [dummyAuthor]);
    expect(mockMsgSend).toHaveBeenCalledWith(
      `**Why do you want to slap yourself, ${dummyAuthor}?**`
    );
  });

  it("should execute command and try to slap the bot", async () => {
    expect.assertions(1);
    mockAuthor.toString.mockReturnValue(dummyAuthor);
    await Slap.execute(msg, [botId]);
    expect(mockMsgSend).toHaveBeenCalledWith(
      `**Nope!\n${botId} slaps ${dummyAuthor} around a bit with a large trout!**`
    );
  });

  it("should execute command and try to slap an other user", async () => {
    expect.assertions(1);
    mockAuthor.toString.mockReturnValue(dummyAuthor);
    await Slap.execute(msg, [dummyUser]);
    expect(mockMsgSend).toHaveBeenCalledWith(
      `**${dummyAuthor} slaps ${dummyUser} around a bit with a large trout!**`
    );
  });

  it("should throw error if no args", async () => {
    expect.assertions(1);
    await expect(Slap.execute(msg, [])).rejects.toEqual(
      new Error("Args undefined")
    );
  });
});
