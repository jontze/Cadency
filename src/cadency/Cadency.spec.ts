import Config from "./Config";
import { Client, Message, MessageEmbed, TextChannel, User } from "discord.js";
import EventEmitter from "events";
import Cadency from "./Cadency";
import * as discordUtils from "../utils/discord";
import * as databaseUtils from "../utils/database";
import messageContent from "../message-content";
import { Server } from ".prisma/client";

const nextTick = () => new Promise((res) => process.nextTick(res));

// Discord mocks
const mockGetSongList = jest.fn();
const mockSetSongList = jest.fn();
const mockDeleteSongList = jest.fn();
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
    msg = new Message({} as unknown as Client, {}, {} as TextChannel);
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
    expect.assertions(5);
    const mockEndDispatcher = jest.fn();
    mockGetSongList.mockReturnValueOnce({
      connection: {
        dispatcher: {
          end: mockEndDispatcher,
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
    expect(mockEndDispatcher).toHaveBeenCalled();
    expect(mockMsgSend).toHaveBeenCalledWith(":fast_forward: **Skipped**");
  });

  it("should emit 'showPlaylist' and fail to show the list", async () => {
    expect.assertions(4);
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
    const mockEndDispatcher = jest.fn();
    mockGetSongList.mockReturnValueOnce({
      connection: {
        dispatcher: {
          end: mockEndDispatcher,
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
    expect(mockEndDispatcher).toHaveBeenCalled();
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
    const mockPauseDispatcher = jest.fn();
    mockGetSongList.mockReturnValueOnce({
      connection: {
        dispatcher: {
          pause: mockPauseDispatcher,
        },
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
    expect(mockPauseDispatcher).toHaveBeenCalled();
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

  it("should emit 'resumeSong' and fail because song allready plaing", async () => {
    expect.assertions(5);
    const mockResumeDispatcher = jest.fn();
    mockGetSongList.mockReturnValueOnce({
      connection: {
        dispatcher: {
          resume: mockResumeDispatcher,
          paused: false,
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
    expect(mockResumeDispatcher).not.toHaveBeenCalled();
    expect(mockMsgSend).toHaveBeenCalledWith(
      ":x: **The music is already playing...**"
    );
  });

  it("should emit 'resumeSong' and resume the song", async () => {
    expect.assertions(5);
    const mockResumeDispatcher = jest.fn();
    mockGetSongList.mockReturnValueOnce({
      connection: {
        dispatcher: {
          resume: mockResumeDispatcher,
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
    expect(mockResumeDispatcher).toHaveBeenCalled();
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
    expect.assertions(8);
    const mockOnPlayEvent = jest
      .fn()
      .mockImplementation(
        (onEvent: string, listener: (...args: any[]) => void) => {
          mockEventHandler.on(onEvent, listener);
        }
      );
    const mockPlay = jest.fn().mockImplementation(() => {
      return {
        on: mockOnPlayEvent,
      };
    });
    const mockChannelJoin = jest.fn();
    mockChannelJoin.mockResolvedValueOnce({
      play: mockPlay,
    });
    const spyMsgContent = jest
      .spyOn(messageContent.song, "add")
      .mockReturnValueOnce("");
    mockGetSongList.mockReturnValueOnce(null);
    mockGetSongList.mockReturnValue({
      voiceChannel: {
        join: mockChannelJoin,
      },
      connection: null,
      playing: false,
      songs: [
        {
          video_url: "",
        },
      ],
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
    expect(mockChannelJoin).toHaveBeenCalled();
    expect(mockPlay).toHaveBeenCalled();
    expect(mockOnPlayEvent).toHaveBeenCalledTimes(2);
  });
});
