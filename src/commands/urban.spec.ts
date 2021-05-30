import Urban from "./urban";
import { Client, Message, TextChannel } from "discord.js";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";

// Message mocks
const mockMsgSend = jest.fn().mockResolvedValue({});

// Embed Message mocks
const mockEmbedColorSet = jest.fn().mockReturnValue({
  setTitle: jest.fn().mockReturnValue({
    setURL: jest.fn().mockReturnValue({
      addFields: jest.fn().mockReturnValue({}),
    }),
  }),
});

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
    MessageEmbed: jest.fn().mockImplementation(() => {
      return {
        setColor: mockEmbedColorSet,
      };
    }),
  };
});

describe("Urban command", () => {
  let msg: Message;

  beforeEach(() => {
    mockMsgSend.mockClear();

    msg = new Message(
      {} as unknown as Client,
      {},
      "" as unknown as TextChannel
    );
  });

  it("should execute command and send an embed message", async () => {
    expect.assertions(1);
    mockAxios
      .onGet("https://api.urbandictionary.com/v0/define?term=test")
      .reply(200, {
        list: [
          {
            word: "",
            permalink: "",
            definition: "",
            example: "",
            thumps_up: "",
            thumps_down: "",
          },
        ],
      });
    const testQuery = "test";
    await Urban.execute(msg, [testQuery]);
    expect(mockMsgSend).toHaveBeenCalledWith({ setColor: mockEmbedColorSet });
  });

  it("should execute command and send message that no entry exists", async () => {
    expect.assertions(1);
    const testQuery = "testNoResult";
    mockAxios
      .onGet(`https://api.urbandictionary.com/v0/define?term=testNoResult`)
      .reply(200, {
        list: [],
      });
    await Urban.execute(msg, [testQuery]);
    expect(mockMsgSend).toBeCalledWith("Kein Eintrag für **testNoResult**.");
  });

  it("should throw error if no args", async () => {
    expect.assertions(1);
    await expect(Urban.execute(msg, [])).rejects.toEqual(
      new Error("Args undefined")
    );
  });
});
