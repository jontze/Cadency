const mockMsgHandler = jest.fn();
import EventEmitter from "events";
import { Client, Message, User } from "discord.js";
import logger from "../logger";
import { getPrefix } from "../utils/database";
import Base from "./Base";
import Config from "./Config";
import { RawMessageData, RawUserData } from "discord.js/typings/rawDataTypes";

const nextTick = () => new Promise((res) => process.nextTick(res));

// Discord mocks
const mockEventHandler = new EventEmitter();
let mockClientUser: User | null = null;
const mockSetPresence = jest.fn();
const mockClientLogin = jest.fn();
const mockMsgSend = jest.fn();
const mockOnEvent = jest
  .fn()
  .mockImplementation((onEvent: string, listener: (...args: any[]) => void) => {
    mockEventHandler.on(onEvent, listener);
  });

jest.mock("discord.js", () => {
  return {
    Intents: {
      FLAGS: {},
    },
    Message: jest.fn().mockImplementation(() => {
      return {
        author: {
          bot: false,
        },
        channel: {
          send: mockMsgSend,
        },
      };
    }),
    Client: jest.fn().mockImplementation(() => {
      return {
        user: mockClientUser,
        login: mockClientLogin,
        on: mockOnEvent,
      };
    }),
    User: jest.fn().mockImplementation(() => {
      return {
        setPresence: mockSetPresence,
      };
    }),
  };
});

// Mock logger to prevent logging during tests
jest.mock("../logger");

// Mock database class to prevent connection try
jest.mock("../database/Database");

jest.mock("../events/messageHandler", () => {
  return {
    messageHandler: mockMsgHandler,
  };
});
jest.mock("../utils/database");

describe("Base Class", () => {
  let msg: Message;
  let clientUser: User;

  beforeEach(() => {
    jest.clearAllMocks();
    mockClientLogin.mockClear();
    mockMsgSend.mockClear();
    mockOnEvent.mockClear();
    mockMsgHandler.mockClear();
    mockSetPresence.mockClear();
    msg = new Message({} as unknown as Client, {} as unknown as RawMessageData);
    clientUser = new User(
      {} as unknown as Client,
      {} as unknown as RawUserData
    );
    mockClientUser = null;
    msg.author.bot = false;
  });

  it("should initialize with config", () => {
    expect.assertions(2);
    const base = new Base(new Config("1234"));
    expect(base).toBeDefined();
    expect(mockOnEvent).toHaveBeenCalledTimes(2);
  });

  it("should start bot", () => {
    expect.assertions(5);
    mockClientLogin.mockResolvedValueOnce({});
    const base = new Base(new Config("1234"));
    base.start();
    expect(base).toBeDefined();
    expect(mockOnEvent.mock.calls[0][0]).toStrictEqual("ready");
    expect(mockOnEvent.mock.calls[1][0]).toStrictEqual("messageCreate");
    expect(mockOnEvent).toBeCalledTimes(2);
    expect(mockClientLogin).toHaveBeenCalledWith("1234");
  });

  it("should start and fail bot", () => {
    mockClientLogin.mockRejectedValueOnce({});
    const base = new Base(new Config("1234"));
    base.start();
    expect(base).toBeDefined();
    expect(mockOnEvent).toHaveBeenCalledTimes(2);
    expect(mockClientLogin).toHaveBeenCalledWith("1234");
  });

  it("should handle incoming message", async () => {
    expect.assertions(4);
    const base = new Base(new Config("1234"));
    mockEventHandler.emit("messageCreate", msg);
    await nextTick();
    expect(base).toBeDefined();
    expect(logger.debug).toHaveBeenCalled();
    expect(mockMsgHandler).toHaveBeenCalled();
    expect(getPrefix).toHaveBeenCalled();
  });

  it("should NOT handle message if from bot", async () => {
    expect.assertions(4);
    msg.author.bot = true;
    const base = new Base(new Config("1234"));
    mockEventHandler.emit("messageCreate", msg);
    await nextTick();
    expect(base).toBeDefined();
    expect(logger.debug).not.toHaveBeenCalled();
    expect(mockMsgHandler).not.toHaveBeenCalled();
    expect(getPrefix).not.toHaveBeenCalled();
  });

  it("should log error and send message if message handling fails", async () => {
    expect.assertions(6);
    mockMsgHandler.mockRejectedValue({});
    const base = new Base(new Config("1234"));
    mockEventHandler.emit("messageCreate", msg);
    await nextTick();
    expect(base).toBeDefined();
    expect(logger.debug).toHaveBeenCalled();
    expect(mockMsgHandler).toHaveBeenCalled();
    expect(getPrefix).toHaveBeenCalled();
    expect(mockMsgSend).toHaveBeenCalled();
    expect(logger.error).toHaveBeenCalled();
  });

  it("should emit 'ready' event and warn about missing user", async () => {
    expect.assertions(3);
    const base = new Base(new Config("1234"));
    mockEventHandler.emit("ready");
    await nextTick();
    expect(base).toBeDefined();
    expect(mockOnEvent).toHaveBeenCalledTimes(2);
    expect(logger.warn).toHaveBeenCalled();
  });

  it("should emit 'ready' event and set user presence", async () => {
    expect.assertions(3);
    mockSetPresence.mockResolvedValue({});
    mockClientUser = clientUser;

    const base = new Base(new Config("1234"));
    mockEventHandler.emit("ready");
    await nextTick();
    expect(base).toBeDefined();
    expect(mockOnEvent).toHaveBeenCalledTimes(2);
    expect(mockSetPresence).toHaveBeenCalled();
  });
});
