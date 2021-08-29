import { Client, Message, User } from "discord.js";
import {
  CommandArgsError,
  CommandError,
  CommandGuildError,
  CommandVoiceError,
} from "../errors/command";
import logger from "../logger";
import messageContent from "../message-content";
import { messageErrorHandler, messageHandler } from "./messageHandler";
import { validateCommand } from "../utils/discord";
import { RawMessageData } from "discord.js/typings/rawDataTypes";

// Discord mocks
const mockMsgSend = jest.fn();

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

jest.mock("../logger");
jest.mock("../utils/discord");

describe("Message handler", () => {
  let msg: Message;

  beforeEach(() => {
    mockMsgSend.mockClear();
    jest.clearAllMocks();
    msg = new Message({} as unknown as Client, {} as unknown as RawMessageData);
  });

  it("should handle received CommandGuildErrors", async () => {
    expect.assertions(1);
    await messageErrorHandler(new CommandGuildError("err"), msg);
    expect(mockMsgSend).toHaveBeenCalledWith("err");
  });

  it("should handle received CommandArgsErrors", async () => {
    expect.assertions(1);
    await messageErrorHandler(new CommandArgsError("err"), msg);
    expect(mockMsgSend).toHaveBeenCalledWith("err");
  });

  it("should handle received CommandVoiceErrors", async () => {
    expect.assertions(1);
    await messageErrorHandler(new CommandVoiceError("err"), msg);
    expect(mockMsgSend).toHaveBeenCalledWith("err");
  });

  it("should handle received CommandErrors", async () => {
    expect.assertions(1);
    await messageErrorHandler(new CommandError("err"), msg);
    expect(mockMsgSend).toHaveBeenCalledWith(
      messageContent.error.command.notFound
    );
  });

  it("should throw error if received unkown error", async () => {
    expect.assertions(2);
    await messageErrorHandler(new Error("err"), msg);
    expect(mockMsgSend).not.toHaveBeenCalled();
    expect(logger.error).toHaveBeenCalled();
  });

  it("should execute ping command", async () => {
    expect.assertions(3);

    msg.content = "!ping";
    msg.author = {
      bot: false,
    } as unknown as User;
    expect(() => messageHandler(msg, "!")).not.toThrowError();
    expect(logger.info).toHaveBeenCalled();
    expect(validateCommand).toHaveBeenCalled();
  });

  it("should try to execute ping command and fail", async () => {
    expect.assertions(3);

    msg.content = "!ping";
    msg.author = {
      bot: true,
    } as unknown as User;
    expect(() => messageHandler(msg, "!")).not.toThrowError();
    expect(logger.info).not.toHaveBeenCalled();
    expect(validateCommand).not.toHaveBeenCalled();
  });
});
