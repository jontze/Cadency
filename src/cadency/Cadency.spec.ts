// Discord mocks must be at top level to be loaded at first
const mockCreateAudioPlayer = jest.fn();
const mockCreateAudioResource = jest.fn();
const mockJoinVoiceChannel = jest.fn();
const mockEntersState = jest.fn();
const mockGetSongList = jest.fn();
const mockSetSongList = jest.fn();
const mockDeleteSongList = jest.fn();

import Config from "./Config";
import { Client, Message, MessageEmbed } from "discord.js";
import EventEmitter from "events";
import Cadency from "./Cadency";
import * as discordUtils from "../utils/discord";
import * as databaseUtils from "../utils/database";
import messageContent from "../message-content";
import { Server } from ".prisma/client";
import { RawMessageData } from "discord.js/typings/rawDataTypes";

const nextTick = () => new Promise((res) => process.nextTick(res));

const mockEventHandler = new EventEmitter();
mockEventHandler.setMaxListeners(40);
const mockMsgSend = jest.fn();
const mockOnEvent = jest
  .fn()
  .mockImplementation((onEvent: string, listener: (...args: any[]) => void) => {
    mockEventHandler.on(onEvent, listener);
  });

jest.mock("discord.js", () => {
  return {
    Intents: {
      FLAGS: {
        GUILDS: 1,
        GUILD_MESSAGES: 2,
        GUILD_MESSAGE_REACTIONS: 3,
        GUILD_MEMBERS: 4,
      },
    },
    Client: jest.fn().mockImplementation(() => {
      return {
        on: mockOnEvent,
      };
    }),
    Collection: jest.fn().mockImplementation(() => {
      return {
        get: mockGetSongList,
        set: mockSetSongList,
        delete: mockDeleteSongList,
      };
    }),
    Message: jest.fn().mockImplementation(() => {
      return {
        author: {
          bot: false,
        },
        channel: {
          send: mockMsgSend,
        },
        guild: {
          name: "ServerName",
        },
      };
    }),
  };
});

// Mock discord voice functions
jest.mock("@discordjs/voice", () => {
  return {
    createAudioPlayer: mockCreateAudioPlayer,
    createAudioResource: mockCreateAudioResource,
    joinVoiceChannel: mockJoinVoiceChannel,
    entersState: mockEntersState,
    AudioPlayerStatus: {
      Paused: "paused",
      Idle: "idle",
    },
    VoiceConnectionStatus: {
      destroyed: "destroyed",
    },
  };
});

// Mock logger to prevent logging during tests
jest.mock("../logger");

// Mock database class to prevent connection try
jest.mock("../database/Database");

// Mock to avoic playing downloading songs in tests
jest.mock("ytdl-core");

jest.mock("../events/messageHandler");
jest.mock("../utils/database");

describe("Cadency class", () => {
  let msg: Message;

  beforeEach(() => {
    jest.clearAllMocks();
    mockMsgSend.mockClear();
    mockOnEvent.mockClear();
    mockGetSongList.mockClear();
    mockSetSongList.mockClear();
    mockDeleteSongList.mockClear();
    mockCreateAudioPlayer.mockClear();
    mockCreateAudioResource.mockClear();
    mockJoinVoiceChannel.mockClear();
    mockEntersState.mockClear();
    msg = new Message({} as unknown as Client, {} as unknown as RawMessageData);
    msg.author.bot = false;
  });

  it("should initialize with config", () => {
    expect.assertions(2);
    const cadency = new Cadency(new Config("1234"));
    expect(mockOnEvent).toHaveBeenCalledTimes(10);
    expect(cadency).toBeDefined();
  });

  it("should emit 'updatePrefix' and update prefix", async () => {
    expect.assertions(5);
    const spyIsNewPrefixValid = jest.spyOn(discordUtils, "isNewPrefixValid");
    const spyUpdatePrefixServer = jest
      .spyOn(databaseUtils, "updatePrefixOfServer")
      .mockResolvedValueOnce({ prefix: "#" } as Server);
    const cadency = new Cadency(new Config("1234"));
    mockEventHandler.emit("updatePrefix", msg, "123", ["#"]);
    await nextTick();
    expect(mockOnEvent).toHaveBeenCalledTimes(10);
    expect(cadency).toBeDefined();
    expect(spyIsNewPrefixValid).toHaveBeenCalled();
    expect(spyUpdatePrefixServer).toHaveBeenCalled();
    expect(mockMsgSend).toHaveBeenCalledWith(
      ":white_check_mark: **Prefix successfully changed to `#`**"
    );
  });

  it("should emit 'updatePrefix' try to update prefix and fail", async () => {
    expect.assertions(5);
    const spyIsNewPrefixValid = jest.spyOn(discordUtils, "isNewPrefixValid");
    const spyUpdatePrefixServer = jest
      .spyOn(databaseUtils, "updatePrefixOfServer")
      .mockRejectedValueOnce(new Error("fail"));
    const cadency = new Cadency(new Config("1234"));
    mockEventHandler.emit("updatePrefix", msg, "123", ["#"]);
    await nextTick();
    expect(mockOnEvent).toHaveBeenCalledTimes(10);
    expect(cadency).toBeDefined();
    expect(spyIsNewPrefixValid).toHaveBeenCalled();
    expect(spyUpdatePrefixServer).toHaveBeenCalled();
    expect(mockMsgSend).toHaveBeenCalledWith(
      ":x: **Failed to change the prefix**"
    );
  });

  it("should emit 'updatePrefix' try to update prefix and fail because it is not valid", async () => {
    expect.assertions(4);
    const spyIsNewPrefixValid = jest
      .spyOn(discordUtils, "isNewPrefixValid")
      .mockReturnValueOnce(false);
    const cadency = new Cadency(new Config("1234"));
    mockEventHandler.emit("updatePrefix", msg, "123", ["#"]);
    await nextTick();
    expect(mockOnEvent).toHaveBeenCalledTimes(10);
    expect(cadency).toBeDefined();
    expect(spyIsNewPrefixValid).toHaveBeenCalled();
    expect(mockMsgSend).toHaveBeenCalledWith(
      ":x: **The prefix is invalid.\nIt cannot be longer than 3 characters and must consist of the following characters `!?%&()\"=#'*` ** "
    );
  });

  it("should emit 'currentSong' and fail because not a known server", async () => {
    expect.assertions(4);
    mockGetSongList.mockReturnValueOnce(null);
    const cadency = new Cadency(new Config("1234"));
    mockEventHandler.emit("currentSong", "123", msg);
    await nextTick();
    expect(mockOnEvent).toHaveBeenCalledTimes(10);
    expect(cadency).toBeDefined();
    expect(mockGetSongList).toHaveBeenCalled();
    expect(mockMsgSend).toHaveBeenCalledWith(":x: **No song is playing...**");
  });

  it("should emit 'currentSong' and fail because no song in the queue", async () => {
    expect.assertions(4);
    mockGetSongList.mockReturnValueOnce({ songs: [null] });
    const cadency = new Cadency(new Config("1234"));
    mockEventHandler.emit("currentSong", "123", msg);
    await nextTick();
    expect(mockOnEvent).toHaveBeenCalledTimes(10);
    expect(cadency).toBeDefined();
    expect(mockGetSongList).toHaveBeenCalled();
    expect(mockMsgSend).toHaveBeenCalledWith(":x: **No song is playing...**");
  });

  it("should emit 'currentSong' and and show current song", async () => {
    expect.assertions(5);
    mockGetSongList.mockReturnValueOnce({ songs: ["NotNull"] });
    const spyMsgContent = jest.spyOn(messageContent.song, "show");
    const cadency = new Cadency(new Config("1234"));
    mockEventHandler.emit("currentSong", "123", msg);
    await nextTick();
    expect(mockOnEvent).toHaveBeenCalledTimes(10);
    expect(cadency).toBeDefined();
    expect(mockGetSongList).toHaveBeenCalled();
    expect(spyMsgContent).toHaveBeenCalled();
    expect(mockMsgSend).toHaveBeenCalled();
  });

  it("should emit 'skipSong' and fail to skip the song", async () => {
    expect.assertions(4);
    mockGetSongList.mockReturnValueOnce(null);
    const cadency = new Cadency(new Config("1233"));
    mockEventHandler.emit("skipSong", "123", msg);
    await nextTick();
    expect(cadency).toBeDefined();
    expect(mockOnEvent).toHaveBeenCalledTimes(10);
    expect(mockGetSongList).toHaveBeenCalled();
    expect(mockMsgSend).toHaveBeenCalledWith(
      ":x: **I can't skip...no music is in the queue.**"
    );
  });

  it("should emit 'skipSong' and skip the song", async () => {
    expect.assertions(7);
    const mockConnectionUnsub = jest.fn();
    const mockDestroyConnection = jest.fn();
    mockGetSongList.mockReturnValueOnce({
      connection: {
        destroy: mockDestroyConnection,
        state: {
          status: "NotDestroyed",
          subscription: {
            unsubscribe: mockConnectionUnsub,
          },
        },
      },
      songs: ["notNull"],
    });
    const cadency = new Cadency(new Config("1233"));
    mockEventHandler.emit("skipSong", "123", msg);
    await nextTick();
    expect(cadency).toBeDefined();
    expect(mockOnEvent).toHaveBeenCalledTimes(10);
    expect(mockGetSongList).toHaveBeenCalled();
    expect(mockDestroyConnection).toHaveBeenCalled();
    expect(mockMsgSend).toHaveBeenCalledWith(":fast_forward: **Skipped**");
    expect(mockConnectionUnsub).toHaveBeenCalledTimes(1);
    expect(mockDeleteSongList).toHaveBeenCalledTimes(1);
  });

  it("should emit 'showPlaylist' and fail to show the list", async () => {
    expect.assertions(4);
    mockGetSongList.mockReturnValueOnce({
      connection: {
        state: {
          status: "notDestroyed",
        },
      },
    });
    const cadency = new Cadency(new Config("1233"));
    mockEventHandler.emit("showPlaylist", "123", msg);
    await nextTick();
    expect(cadency).toBeDefined();
    expect(mockOnEvent).toHaveBeenCalledTimes(10);
    expect(mockGetSongList).toHaveBeenCalled();
    expect(mockMsgSend).toHaveBeenCalledWith(
      ":no_entry_sign: **No songs in the queue**"
    );
  });

  it("should emit 'showPlaylist' show the list", async () => {
    expect.assertions(4);
    mockGetSongList.mockReturnValueOnce({
      connection: {
        state: {
          status: "notDestroyed",
        },
        dispatcher: {},
      },
      songs: ["notNull"],
    });
    const spyMsgContent = jest
      .spyOn(messageContent.song, "showPlaylist")
      .mockReturnValue("" as unknown as MessageEmbed);
    const cadency = new Cadency(new Config("1233"));
    mockEventHandler.emit("showPlaylist", "123", msg);
    await nextTick();
    expect(cadency).toBeDefined();
    expect(mockOnEvent).toHaveBeenCalledTimes(10);
    expect(mockGetSongList).toHaveBeenCalled();
    expect(spyMsgContent).toHaveBeenCalled();
  });

  it("should emit 'purgePlaylist' and fail", async () => {
    expect.assertions(4);
    const cadency = new Cadency(new Config("1233"));
    mockEventHandler.emit("purgePlaylist", "123", msg);
    await nextTick();
    expect(cadency).toBeDefined();
    expect(mockOnEvent).toHaveBeenCalledTimes(10);
    expect(mockGetSongList).toHaveBeenCalled();
    expect(mockMsgSend).toHaveBeenCalledWith(
      ":no_entry_sign: **The playlist is already empty**"
    );
  });

  it("should emit 'purgePlaylist' and purge the list", async () => {
    expect.assertions(5);
    const mockDestroyConnection = jest.fn();
    mockGetSongList.mockReturnValueOnce({
      connection: {
        destroy: mockDestroyConnection,
        state: {
          status: "NotDestroyed",
        },
      },
      songs: ["notNull"],
      playing: true,
    });
    const cadency = new Cadency(new Config("1233"));
    mockEventHandler.emit("purgePlaylist", "123", msg);
    await nextTick();
    expect(cadency).toBeDefined();
    expect(mockOnEvent).toHaveBeenCalledTimes(10);
    expect(mockGetSongList).toHaveBeenCalled();
    expect(mockDestroyConnection).toHaveBeenCalled();
    expect(mockMsgSend).toHaveBeenCalledWith(
      ":white_check_mark: :wastebasket: **Successfully cleared the playlist**"
    );
  });

  it("should emit 'pauseSong' and fail", async () => {
    expect.assertions(4);
    const cadency = new Cadency(new Config("1233"));
    mockEventHandler.emit("pauseSong", "123", msg);
    await nextTick();
    expect(cadency).toBeDefined();
    expect(mockOnEvent).toHaveBeenCalledTimes(10);
    expect(mockGetSongList).toHaveBeenCalled();
    expect(mockMsgSend).toHaveBeenCalledWith(
      ":x: **I can't pause...no music is playing.**"
    );
  });

  it("should emit 'pauseSong' and pause the song", async () => {
    expect.assertions(5);
    const mockPause = jest.fn();
    mockGetSongList.mockReturnValueOnce({
      player: {
        pause: mockPause,
      },
      songs: ["notNull"],
      playing: true,
    });
    const cadency = new Cadency(new Config("1233"));
    mockEventHandler.emit("pauseSong", "123", msg);
    await nextTick();
    expect(cadency).toBeDefined();
    expect(mockOnEvent).toHaveBeenCalledTimes(10);
    expect(mockGetSongList).toHaveBeenCalled();
    expect(mockPause).toHaveBeenCalled();
    expect(mockMsgSend).toHaveBeenCalledWith(":pause_button: **Paused**");
  });

  it("should emit 'resumeSong' and fail", async () => {
    expect.assertions(4);
    const cadency = new Cadency(new Config("1233"));
    mockEventHandler.emit("resumeSong", "123", msg);
    await nextTick();
    expect(cadency).toBeDefined();
    expect(mockOnEvent).toHaveBeenCalledTimes(10);
    expect(mockGetSongList).toHaveBeenCalled();
    expect(mockMsgSend).toHaveBeenCalledWith(
      ":x: **There is nothing to resume.**"
    );
  });

  it("should emit 'resumeSong' and fail because song allready playing", async () => {
    expect.assertions(5);
    const mockUnpause = jest.fn();
    mockGetSongList.mockReturnValueOnce({
      player: {
        unpause: mockUnpause,
        state: {
          status: "NotPaused",
        },
      },
      songs: ["notNull"],
      playing: true,
    });
    const cadency = new Cadency(new Config("1233"));
    mockEventHandler.emit("resumeSong", "123", msg);
    await nextTick();
    expect(cadency).toBeDefined();
    expect(mockOnEvent).toHaveBeenCalledTimes(10);
    expect(mockGetSongList).toHaveBeenCalled();
    expect(mockUnpause).not.toHaveBeenCalled();
    expect(mockMsgSend).toHaveBeenCalledWith(
      ":x: **The music is already playing...**"
    );
  });

  it("should emit 'resumeSong' and resume the song", async () => {
    expect.assertions(5);
    const mockUnpause = jest.fn();
    mockGetSongList.mockReturnValueOnce({
      player: {
        unpause: mockUnpause,
        state: {
          status: "paused",
        },
      },
      songs: ["notNull"],
      playing: false,
    });
    const cadency = new Cadency(new Config("1233"));
    mockEventHandler.emit("resumeSong", "123", msg);
    await nextTick();
    expect(cadency).toBeDefined();
    expect(mockOnEvent).toHaveBeenCalledTimes(10);
    expect(mockGetSongList).toHaveBeenCalled();
    expect(mockUnpause).toHaveBeenCalled();
    expect(mockMsgSend).toHaveBeenCalledWith(":play_pause: **Resumed**");
  });

  it("should emit 'addSong' and add song to existing playlist", async () => {
    expect.assertions(4);
    const spyMsgContent = jest
      .spyOn(messageContent.song, "add")
      .mockReturnValueOnce("");
    mockGetSongList.mockReturnValueOnce({
      songs: [],
    });
    const cadency = new Cadency(new Config("1233"));
    mockEventHandler.emit("addSong", { info: "" }, "123", msg);
    await nextTick();
    expect(cadency).toBeDefined();
    expect(mockOnEvent).toHaveBeenCalledTimes(10);
    expect(mockGetSongList).toHaveBeenCalled();
    expect(spyMsgContent).toHaveBeenCalled();
  });

  it("should emit 'addSong', create playlist, add the song, try to start playing but song list empty", async () => {
    expect.assertions(5);
    const spyMsgContent = jest
      .spyOn(messageContent.song, "add")
      .mockReturnValueOnce("");
    mockGetSongList.mockReturnValue(null);
    const cadency = new Cadency(new Config("1233"));
    mockEventHandler.emit(
      "addSong",
      { info: "", textChannel: "", voiceChannel: "" },
      "123",
      msg
    );
    await nextTick();
    expect(cadency).toBeDefined();
    expect(mockOnEvent).toHaveBeenCalledTimes(10);
    expect(mockGetSongList).toHaveBeenCalled();
    expect(mockSetSongList).toHaveBeenCalled();
    expect(spyMsgContent).toHaveBeenCalled();
  });

  it("should emit 'addSong', create playlist, add the song and start playing", async () => {
    expect.assertions(12);
    const spyMsgContent = jest
      .spyOn(messageContent.song, "add")
      .mockReturnValueOnce("");
    mockGetSongList.mockReturnValueOnce(null);
    mockGetSongList.mockReturnValue({
      connection: null,
      playing: false,
      songs: [
        {
          video_url: "",
        },
      ],
    });
    const mockConnectionSubscribe = jest.fn();
    const mockConnectionDestroy = jest.fn();
    const mockPlayPlayer = jest.fn();
    const mockOnPlayer = jest
      .fn()
      .mockImplementation(
        (onEvent: string, listener: (...args: any[]) => void) => {
          mockEventHandler.on(onEvent, listener);
        }
      );
    mockCreateAudioResource.mockReturnValueOnce("testSong");
    mockJoinVoiceChannel.mockReturnValueOnce({
      subscribe: mockConnectionSubscribe,
      destroy: mockConnectionDestroy,
    });
    mockCreateAudioPlayer.mockReturnValueOnce({
      play: mockPlayPlayer,
      on: mockOnPlayer,
    });

    const cadency = new Cadency(new Config("1233"));
    mockEventHandler.emit(
      "addSong",
      { info: "", textChannel: "", voiceChannel: "" },
      "123",
      msg
    );
    await nextTick();
    expect(cadency).toBeDefined();
    expect(mockOnEvent).toHaveBeenCalledTimes(10);
    expect(mockGetSongList).toHaveBeenCalled();
    expect(mockSetSongList).toHaveBeenCalled();
    expect(spyMsgContent).toHaveBeenCalled();
    expect(mockCreateAudioResource).toHaveBeenCalledTimes(1);
    expect(mockJoinVoiceChannel).toHaveBeenCalledTimes(1);
    expect(mockCreateAudioPlayer).toHaveBeenCalledTimes(1);
    expect(mockConnectionSubscribe).toHaveBeenCalledTimes(1);
    expect(mockPlayPlayer).toHaveBeenCalledTimes(1);
    expect(mockOnPlayer).toHaveBeenCalledTimes(2);
    expect(mockEntersState).toHaveBeenCalledTimes(1);
  });
});
