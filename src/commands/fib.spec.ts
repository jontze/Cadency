import Fib from "./fib";

const mockMsgSend = jest.fn().mockResolvedValue({});

import { Client, Message } from "discord.js";
import { CommandArgsError } from "../errors/command";
import { RawMessageData } from "discord.js/typings/rawDataTypes";

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

describe("Fib command", () => {
  let msg: Message;

  beforeEach(() => {
    mockMsgSend.mockClear();
    msg = new Message({} as unknown as Client, {} as unknown as RawMessageData);
  });

  it("should execute command", async () => {
    expect.assertions(1);
    await Fib.execute(msg, ["10"]);
    expect(mockMsgSend).toHaveBeenCalledWith("55");
  });

  it("should send message if input invalid", async () => {
    expect.assertions(1);
    await Fib.execute(msg, ["notANumber"]);
    expect(mockMsgSend).toHaveBeenCalledWith(
      "**Is `notANumber` really a valid number?**"
    );
  });

  it("should throw Error if args are empty", async () => {
    expect.assertions(1);
    await expect(Fib.execute(msg, [])).rejects.toBeInstanceOf(CommandArgsError);
  });
});
