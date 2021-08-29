import Skip from "./skip";
import { Client, Message } from "discord.js";
import { getGuildId, validateVoiceCommand } from "../utils/discord";
import { RawMessageData } from "discord.js/typings/rawDataTypes";

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

describe("Skip command", () => {
  let msg: Message;

  beforeEach(() => {
    jest.clearAllMocks();
    mockEmit.mockClear();
    msg = new Message({} as unknown as Client, {} as unknown as RawMessageData);
  });

  it("should execute command", async () => {
    expect.assertions(3);
    await Skip.execute(msg, []);
    expect(validateVoiceCommand).toHaveBeenCalled();
    expect(getGuildId).toHaveBeenCalledWith(msg);
    expect(mockEmit).toHaveBeenCalled();
  });
});
