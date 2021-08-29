import { Role } from ".prisma/client";
import { Client, Message } from "discord.js";
import { RawMessageData } from "discord.js/typings/rawDataTypes";
import { CommandVoiceError } from "../errors/command";
import messageContent from "../message-content";
import { Command } from "../typings";
import {
  getGuildId,
  isNewPrefixValid,
  validateCommand,
  validateVoiceCommand,
} from "./discord";

// Discord mocks
const mockPermissionsForChannel = jest.fn();
let mockVoiceId = "123";
let mockGuildId = "4321";
let mockChannelType = "text";
const mockClientUser: string | null = "UserObj";
const mockHasPermission = jest.fn();

jest.mock("discord.js", () => {
  return {
    Permissions: {
      FLAGS: {},
    },
    Message: jest.fn().mockImplementation(() => {
      return {
        member: {
          voice: {
            channel: {
              permissionsFor: mockPermissionsForChannel,
              id: mockVoiceId,
            },
          },
          permissions: {
            has: mockHasPermission,
          },
        },
        client: {
          user: mockClientUser,
        },
        channel: {
          type: mockChannelType,
        },
        guild: {
          id: mockGuildId,
        },
      };
    }),
  };
});

describe("Discord Utils", () => {
  let msg: Message;

  beforeEach(() => {
    jest.clearAllMocks();
    msg = new Message({} as unknown as Client, {} as unknown as RawMessageData);
  });

  it("should extract guild id", () => {
    expect.assertions(1);
    const guildId = getGuildId(msg);
    expect(guildId).toBe(mockGuildId);
  });

  it("should validate command", () => {
    expect.assertions(2);
    mockHasPermission.mockReturnValue(true);
    let command = {
      permission: Role.ADMIN,
      guildOnly: true,
      args: true,
    } as unknown as Command;
    msg.channel.type = "GUILD_TEXT";

    expect(() => validateCommand(command, ["test"], msg)).not.toThrowError();
    expect(mockHasPermission).toHaveBeenCalled();
  });

  it("should try to validate command and throw args error", () => {
    expect.assertions(2);
    mockHasPermission.mockReturnValue(true);
    let command = {
      permission: Role.ADMIN,
      guildOnly: true,
      args: true,
    } as unknown as Command;
    msg.channel.type = "GUILD_TEXT";

    expect(() => validateCommand(command, [], msg)).toThrowError(
      messageContent.error.command.noArgs
    );
    expect(mockHasPermission).not.toHaveBeenCalled();
  });

  it("should try to validate command and throw guild error", () => {
    expect.assertions(2);
    mockHasPermission.mockReturnValue(true);
    let command = {
      permission: Role.ADMIN,
      guildOnly: true,
      args: true,
    } as unknown as Command;
    msg.channel.type = "DM";

    expect(() => validateCommand(command, ["test"], msg)).toThrowError(
      messageContent.error.command.guildOnly
    );
    expect(mockHasPermission).not.toHaveBeenCalled();
  });

  it("should try to validate command and throw permission error", () => {
    expect.assertions(2);

    mockHasPermission.mockReturnValue(false);
    let command = {
      permission: Role.ADMIN,
      guildOnly: true,
      args: true,
    } as unknown as Command;
    msg.channel.type = "GUILD_TEXT";

    expect(() => validateCommand(command, ["test"], msg)).toThrowError(
      messageContent.error.command.noPermission
    );
    expect(mockHasPermission).toHaveBeenCalled();
  });

  it("should validate voice channel", () => {
    expect.assertions(3);
    mockHasPermission.mockReturnValue(true);
    mockPermissionsForChannel.mockReturnValueOnce({ has: () => true });
    let command = {
      permission: Role.ADMIN,
      guildOnly: true,
      args: true,
    } as unknown as Command;
    msg.channel.type = "GUILD_TEXT";

    expect(() =>
      validateVoiceCommand(command, ["test"], msg)
    ).not.toThrowError();
    expect(mockHasPermission).toHaveBeenCalled();
    expect(mockPermissionsForChannel).toHaveBeenCalledWith(mockClientUser);
  });

  it("should throw CommandVoiceError on invalid voice channel", () => {
    expect.assertions(3);
    mockHasPermission.mockReturnValue(true);
    mockPermissionsForChannel.mockReturnValueOnce({ has: () => false });
    let command = {
      permission: Role.ADMIN,
      guildOnly: true,
      args: true,
    } as unknown as Command;
    msg.channel.type = "GUILD_TEXT";
    try {
      validateVoiceCommand(command, ["test"], msg);
    } catch (e) {
      expect(mockHasPermission).toHaveBeenCalled();
      expect(mockPermissionsForChannel).toBeCalledWith(mockClientUser);
      expect(e instanceof CommandVoiceError).toBe(true);
    }
  });

  it("should validate matching new prefix", () => {
    expect.assertions(1);
    const isValid = isNewPrefixValid("!");
    expect(isValid).toBe(true);
  });

  it("should reject new prefix due to length", () => {
    expect.assertions(1);
    const isValid = isNewPrefixValid("!!!!!!!!!");
    expect(isValid).toBe(false);
  });

  it("should reject new prefix due to invalid char", () => {
    expect.assertions(1);
    const isValid = isNewPrefixValid("a");
    expect(isValid).toBe(false);
  });
});
