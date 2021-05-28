import messageContent from "../message-content";
import {
  getCommandByName,
  hasPrefix,
  parseArgs,
  parseArgsAndCommand,
  parseCommand,
  removePrefixFromMessage,
} from "./parser";

describe("Parser", () => {
  it("should detect that message has prefix", () => {
    const msg = "!hello world";
    expect(hasPrefix(msg, "!")).toBe(true);
  });

  it("should detect that message has no prefix", () => {
    const msg = "hello world";
    expect(hasPrefix(msg, "!")).toBe(false);
  });

  it("should remove prefix from message beginning", () => {
    const msg = "!hello world";
    const msgWithoutPrefix = removePrefixFromMessage(msg, "!");
    expect(msgWithoutPrefix).not.toContain("!");
  });

  it("should parse command name from string", () => {
    const msg = "Hello world";
    const commandName = parseCommand(msg);
    expect(commandName).toBe("HELLO");
  });

  it("should throw error if command name null", () => {
    const msg = "";
    try {
      parseCommand(msg);
    } catch (e) {
      expect(e.message).toBe("Command name undefined");
    }
  });

  it("should parse arguments from string", () => {
    const msg = "Hello pretty world";
    const args = parseArgs(msg);
    expect(args).toContain("pretty");
    expect(args).toContain("world");
    expect(args).not.toContain("Hello");
  });

  it("should remove prefix and parse args and command from string", () => {
    const msg = "!Hello pretty world";
    const res = parseArgsAndCommand(msg, "!");
    expect(res.name).toBe("HELLO");
    expect(res.args).toContain("pretty");
    expect(res.args).toContain("world");
  });

  it("should get command by name", () => {
    const commandName = "PING";
    expect(getCommandByName(commandName)).toBeDefined();
  });

  it("should throw Error if no command found by name", () => {
    const commandName = "DOESNOTEXIST";
    try {
      getCommandByName(commandName);
    } catch (e) {
      expect(e.message).toBe(messageContent.error.command.notFound);
    }
  });
});
