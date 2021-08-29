import Inspire from "./inspire";
import { Client, Message } from "discord.js";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { RawMessageData } from "discord.js/typings/rawDataTypes";

// Message mocks
const mockMsgSend = jest.fn().mockResolvedValue({});

// Mock axios
const mockAxios = new MockAdapter(axios);

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

describe("Inspire command", () => {
  let msg: Message;

  beforeEach(() => {
    mockMsgSend.mockClear();

    msg = new Message({} as unknown as Client, {} as unknown as RawMessageData);
  });

  it("should execute command", async () => {
    expect.assertions(1);
    const mockData = { image: "someImage" };
    mockAxios
      .onGet("https://inspirobot.me/api?generate=true")
      .reply(200, mockData);
    await Inspire.execute(msg, []);
    expect(mockMsgSend).toHaveBeenCalledWith(mockData);
  });
});
