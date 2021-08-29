import { Client, Message } from "discord.js";
import { RawMessageData } from "discord.js/typings/rawDataTypes";
import { getGuildId } from "../utils/discord";
import Prefix from "./prefix";

// discord mock
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

describe("Prefix command", () => {
  let msg: Message;

  beforeEach(() => {
    msg = new Message({} as unknown as Client, {} as unknown as RawMessageData);
  });

  it("should execute command", async () => {
    await Prefix.execute(msg, []);
    expect(getGuildId).toHaveBeenLastCalledWith(msg);
    expect(mockEmit).toHaveBeenCalled();
  });
});
